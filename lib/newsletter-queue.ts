import { Resend } from "resend";
import { makeBlogSlug } from "./blog-cms";
import { db, dbAll, dbCount } from "./email-store";
import {
  emailDocument,
  senderName,
  type NewsletterSubscriber,
} from "./newsletter";

// Resend's free plan allows 100 emails in any 24 hours. Newsletters use what is
// left after a small reserve for test and Compose emails. Everyone else waits in
// newsletter_deliveries until the cron job (vercel.json) sends the next batch.
const dailyLimit = Number(process.env.NEWSLETTER_DAILY_LIMIT) || 100;
const dailyReserve = Number(process.env.NEWSLETTER_DAILY_RESERVE ?? 5) || 0;
export const newsletterDailyAllowance = Math.max(0, dailyLimit - dailyReserve);

const chunkSize = 20;
const dayMs = 24 * 60 * 60 * 1000;
const sender = "hello@ladyprowess.com";
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "https://ladyprowess.com";

type Row = Record<string, unknown>;

type Campaign = {
  id: string;
  post_id: string | null;
  title: string;
  excerpt: string;
  content_html: string;
  topic: string;
  post_url: string | null;
  created_at: string;
};

type Delivery = {
  id: string;
  campaign_id: string;
  subscriber_id: string;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  status: string;
  published_at: string | null;
};

export type QueueRunResult = {
  sent: number;
  waiting: number;
  problem?: string;
};

export type PostEmailSummary = {
  recipients: number;
  sent: number;
  waiting: number;
  skipped: number;
  opened: number;
  clicked: number;
};

export type PostEmailRecipient = {
  email: string;
  status: "sent" | "waiting" | "skipped";
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  clicks: number;
  tracked: boolean;
};

export type PostEmailReport = {
  title: string;
  postStatus: "draft" | "scheduled" | "published";
  publishedAt: string | null;
  summary: PostEmailSummary;
  recipients: PostEmailRecipient[];
  links: { url: string; clicks: number; people: number }[];
  untracked: number;
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const inList = (ids: string[]) =>
  `(${Array.from(new Set(ids)).map(encodeURIComponent).join(",")})`;

async function updateDeliveries(ids: string[], patch: Row) {
  for (let index = 0; index < ids.length; index += 100)
    await db(`newsletter_deliveries?id=in.${inList(ids.slice(index, index + 100))}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
}

function waitingCount() {
  return dbCount("newsletter_deliveries?select=id&status=in.(pending,sending)");
}

async function sentInLast24Hours() {
  const since = encodeURIComponent(new Date(Date.now() - dayMs).toISOString());
  const [newsletters, composed] = await Promise.all([
    dbCount(`newsletter_deliveries?select=id&status=eq.sent&sent_at=gte.${since}`),
    dbCount(`sent_emails?select=id&status=eq.sent&sent_at=gte.${since}`).catch(() => 0),
  ]);
  return newsletters + composed;
}

function slugFromUrl(url: unknown) {
  const path = (String(url || "").split("/blog/")[1] || "").split(/[?#]/)[0];
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

const postUrlFor = (slug: string) => `${siteUrl()}/blog/${encodeURIComponent(slug)}`;

// UTM tags let PostHog show which visits came from the newsletter.
function withUtm(url: string, slug: string) {
  return `${url}${url.includes("?") ? "&" : "?"}utm_source=newsletter&utm_medium=email&utm_campaign=${encodeURIComponent(slug)}`;
}

async function postsById(
  ids: string[],
  fields = "id,slug,title,excerpt,content_html,status,published_at",
) {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (!unique.length) return new Map<string, Post>();
  const rows = (await db(`blog_posts?select=${fields}&id=in.${inList(unique)}`)) as Post[];
  return new Map(rows.map((post) => [String(post.id), post]));
}

// A newsletter for a blog post waits until the post is live, and is dropped if
// the post was deleted. Two minutes of leeway covers a slightly fast admin clock.
function campaignState(
  campaign: Pick<Campaign, "post_id">,
  posts: Map<string, Post>,
  now = Date.now(),
) {
  if (!campaign.post_id) return "due" as const;
  const post = posts.get(String(campaign.post_id));
  if (!post) return "gone" as const;
  if (
    post.status !== "published" ||
    !post.published_at ||
    Date.parse(post.published_at) > now + 2 * 60 * 1000
  )
    return "later" as const;
  return "due" as const;
}

// Newsletters sent before posts were linked by id are matched through their URL.
function belongsToPost(campaign: Row, post: Pick<Post, "id" | "slug" | "title">) {
  if (campaign.post_id) return String(campaign.post_id) === String(post.id);
  const slug = slugFromUrl(campaign.post_url);
  return Boolean(slug) && (slug === post.slug || slug === makeBlogSlug(post.title));
}

// Subscribers who were still waiting an hour after the previous newsletter was
// queued go to the front this time, so the same people are not always last.
async function subscribersWhoWaitedLastTime() {
  const [last] = await db(
    "newsletter_campaigns?select=id,created_at&order=created_at.desc&limit=1",
  );
  if (!last) return new Set<string>();
  const cutoff = new Date(String(last.created_at)).getTime() + 60 * 60 * 1000;
  const rows = await dbAll(
    `newsletter_deliveries?select=subscriber_id,status,sent_at&campaign_id=eq.${encodeURIComponent(String(last.id))}&order=id.asc`,
  );
  return new Set(
    rows
      .filter(
        (row) =>
          row.status === "pending" ||
          (row.sent_at && new Date(String(row.sent_at)).getTime() > cutoff),
      )
      .map((row) => String(row.subscriber_id)),
  );
}

export async function queueCampaign(input: {
  title: string;
  excerpt: string;
  contentHtml: string;
  topic: string;
  postUrl: string;
  postId?: string;
  subscribers: NewsletterSubscriber[];
  exclude?: Set<string>;
}) {
  const waitedLastTime = await subscribersWhoWaitedLastTime();
  const recipients = input.subscribers
    .filter((subscriber) => !input.exclude?.has(subscriber.email.toLowerCase()))
    .sort(
      (a, b) =>
        Number(waitedLastTime.has(b.id)) - Number(waitedLastTime.has(a.id)),
    );
  if (!recipients.length) return { campaignId: "", queued: 0 };

  const [campaign] = await db("newsletter_campaigns", {
    method: "POST",
    body: JSON.stringify({
      title: input.title,
      excerpt: input.excerpt,
      content_html: input.contentHtml,
      topic: input.topic,
      post_url: input.postUrl,
      post_id: input.postId || null,
    }),
  });
  const campaignId = String(campaign?.id || "");
  if (!campaignId) throw new Error("Could not create the newsletter queue.");

  await db("newsletter_deliveries", {
    method: "POST",
    body: JSON.stringify(
      recipients.map((subscriber, index) => ({
        campaign_id: campaignId,
        subscriber_id: subscriber.id,
        email: subscriber.email,
        queue_position: index,
      })),
    ),
  });
  return { campaignId, queued: recipients.length };
}

export async function processNewsletterQueue(): Promise<QueueRunResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return { sent: 0, waiting: await waitingCount(), problem: "Resend is not configured." };

  const allowance = newsletterDailyAllowance - (await sentInLast24Hours());
  if (allowance <= 0) return { sent: 0, waiting: await waitingCount() };

  const pending = (await dbAll(
    "newsletter_deliveries?select=id,campaign_id,subscriber_id&status=eq.pending&order=created_at.asc,queue_position.asc,id.asc",
  )) as Delivery[];
  if (!pending.length) return { sent: 0, waiting: await waitingCount() };

  const campaigns = new Map(
    (
      (await db(
        `newsletter_campaigns?select=*&id=in.${inList(pending.map((d) => d.campaign_id))}`,
      )) as Campaign[]
    ).map((campaign) => [campaign.id, campaign]),
  );
  const posts = await postsById(
    Array.from(campaigns.values()).map((campaign) => campaign.post_id || ""),
  );
  const now = Date.now();
  const stateOf = (delivery: Delivery) => {
    const campaign = campaigns.get(delivery.campaign_id);
    return campaign ? campaignState(campaign, posts, now) : "gone";
  };

  // A few extra rows are read so people who unsubscribed do not use up today's slots.
  const candidates = pending
    .filter((delivery) => stateOf(delivery) === "due")
    .slice(0, allowance + 50);
  const subscribers = new Map<string, NewsletterSubscriber>();
  if (candidates.length)
    (
      (await db(
        `newsletter_subscribers?select=id,email,status,unsubscribe_token&id=in.${inList(candidates.map((d) => d.subscriber_id))}`,
      )) as NewsletterSubscriber[]
    ).forEach((subscriber) => subscribers.set(subscriber.id, subscriber));
  const active = (delivery: Delivery) =>
    subscribers.get(delivery.subscriber_id)?.status === "active";

  // People who unsubscribed while waiting, and emails for deleted posts, are dropped.
  const skipped = [
    ...pending.filter((delivery) => stateOf(delivery) === "gone"),
    ...candidates.filter((delivery) => !active(delivery)),
  ];
  if (skipped.length)
    await updateDeliveries(
      skipped.map((delivery) => delivery.id),
      { status: "skipped" },
    );
  const ready = candidates.filter(active).slice(0, allowance);

  const emailFor = (delivery: Delivery) => {
    const campaign = campaigns.get(delivery.campaign_id) as Campaign;
    const subscriber = subscribers.get(delivery.subscriber_id) as NewsletterSubscriber;
    // Blog newsletters use the post as it is now, so edits after scheduling are included.
    const post = campaign.post_id ? posts.get(campaign.post_id) : undefined;
    const title = post?.title || campaign.title;
    const postUrl = post ? postUrlFor(post.slug) : campaign.post_url;
    return {
      from: `${senderName(campaign.topic)} <${sender}>`,
      to: [subscriber.email],
      replyTo: sender,
      subject: title,
      html: emailDocument({
        title,
        excerpt: post?.excerpt || campaign.excerpt,
        contentHtml: post?.content_html || campaign.content_html,
        topic: campaign.topic,
        postUrl: postUrl
          ? withUtm(postUrl, post?.slug || slugFromUrl(campaign.post_url))
          : undefined,
        unsubscribeUrl: `${siteUrl()}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`,
      }),
    };
  };

  const resend = new Resend(apiKey);
  let sent = 0;
  let problem: string | undefined;

  for (let index = 0; index < ready.length; index += chunkSize) {
    // Resend allows two API requests per second.
    if (index) await pause(600);
    const batch = ready.slice(index, index + chunkSize);
    // Claiming rows as "sending" first stops two runs from emailing the same person.
    const claimed = new Set(
      (
        await db(
          `newsletter_deliveries?id=in.${inList(batch.map((d) => d.id))}&status=eq.pending`,
          { method: "PATCH", body: JSON.stringify({ status: "sending" }) },
        )
      ).map((row) => String(row.id)),
    );
    const chunk = batch.filter((delivery) => claimed.has(delivery.id));
    if (!chunk.length) continue;
    const ids = chunk.map((delivery) => delivery.id);

    let failure: { name?: string; message: string } | null = null;
    let resendIds: { id: string }[] = [];
    try {
      const { data, error } = await resend.batch.send(chunk.map(emailFor));
      failure = error;
      resendIds = data?.data || [];
    } catch (error) {
      failure = {
        message: error instanceof Error ? error.message : "Could not reach Resend.",
      };
    }

    if (failure) {
      await updateDeliveries(ids, { status: "pending", error: failure.message });
      // The daily limit is expected; everyone left simply waits for the next run.
      if (/monthly/i.test(failure.name || ""))
        problem =
          "Resend's monthly limit has been reached. The rest will be sent when it resets.";
      else if (!/quota/i.test(failure.name || "")) problem = failure.message;
      break;
    }

    // Resend returns one id per email, in order. The webhook uses it to record opens and clicks.
    const sentAt = new Date().toISOString();
    await Promise.all(
      chunk.map((delivery, position) =>
        db(`newsletter_deliveries?id=eq.${encodeURIComponent(delivery.id)}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "sent",
            sent_at: sentAt,
            error: null,
            resend_id: resendIds[position]?.id || null,
          }),
        }),
      ),
    );
    sent += chunk.length;
  }

  return { sent, waiting: await waitingCount(), problem };
}

export async function campaignProgress(campaignIds: string[]) {
  const rows = await dbAll(
    `newsletter_deliveries?select=status&campaign_id=in.${inList(campaignIds)}&order=id.asc`,
  );
  return {
    total: rows.filter((row) => row.status !== "skipped").length,
    sent: rows.filter((row) => row.status === "sent").length,
    waiting: rows.filter((row) => row.status === "pending" || row.status === "sending")
      .length,
  };
}

export async function queueStatus() {
  const [waiting, usedToday] = await Promise.all([
    dbAll("newsletter_deliveries?select=campaign_id&status=in.(pending,sending)&order=id.asc"),
    sentInLast24Hours(),
  ]);
  const ids = waiting.map((row) => String(row.campaign_id));
  const campaigns = ids.length
    ? ((await db(
        `newsletter_campaigns?select=id,title,created_at,post_id&id=in.${inList(ids)}&order=created_at.asc`,
      )) as Campaign[])
    : [];
  const posts = await postsById(
    campaigns.map((campaign) => campaign.post_id || ""),
    "id,title,status,published_at",
  );
  return {
    waiting: waiting.length,
    usedToday,
    dailyAllowance: newsletterDailyAllowance,
    campaigns: campaigns.map((campaign) => {
      const post = campaign.post_id ? posts.get(campaign.post_id) : undefined;
      const onHold = campaignState(campaign, posts) === "later";
      return {
        id: String(campaign.id),
        title: post?.title || String(campaign.title),
        createdAt: String(campaign.created_at),
        waiting: ids.filter((id) => id === campaign.id).length,
        onHold,
        scheduledFor: onHold && post?.status === "published" ? post.published_at : null,
      };
    }),
  };
}

function summarise(rows: { status: string; opened: boolean; clicked: boolean }[]): PostEmailSummary {
  const sent = rows.filter((row) => row.status === "sent");
  return {
    recipients: rows.filter((row) => row.status !== "skipped").length,
    sent: sent.length,
    waiting: rows.filter((row) => row.status === "pending" || row.status === "sending").length,
    skipped: rows.filter((row) => row.status === "skipped").length,
    opened: sent.filter((row) => row.opened).length,
    clicked: sent.filter((row) => row.clicked).length,
  };
}

// One summary per blog post id, for the post cards in the blog admin.
export async function postEmailSummaries() {
  const [posts, campaigns, deliveries, events] = await Promise.all([
    dbAll("blog_posts?select=id,slug,title&order=id.asc"),
    dbAll("newsletter_campaigns?select=id,post_id,post_url&order=id.asc"),
    dbAll("newsletter_deliveries?select=id,campaign_id,status&order=id.asc"),
    dbAll("newsletter_events?select=delivery_id,event_type&order=id.asc"),
  ]);
  const postOf = new Map<string, string>();
  for (const campaign of campaigns) {
    const post = posts.find((item) => belongsToPost(campaign, item as Post));
    if (post) postOf.set(String(campaign.id), String(post.id));
  }
  // A click also counts as an open, because some email apps block the open pixel.
  const opened = new Set(events.map((event) => String(event.delivery_id)));
  const clicked = new Set(
    events.filter((event) => event.event_type === "click").map((event) => String(event.delivery_id)),
  );
  const grouped: Record<string, { status: string; opened: boolean; clicked: boolean }[]> = {};
  for (const delivery of deliveries) {
    const postId = postOf.get(String(delivery.campaign_id));
    if (!postId) continue;
    (grouped[postId] ||= []).push({
      status: String(delivery.status),
      opened: opened.has(String(delivery.id)),
      clicked: clicked.has(String(delivery.id)),
    });
  }
  return Object.fromEntries(
    Object.entries(grouped).map(([postId, rows]) => [postId, summarise(rows)]),
  ) as Record<string, PostEmailSummary>;
}

function cleanLink(raw: string) {
  try {
    const url = new URL(raw);
    Array.from(url.searchParams.keys())
      .filter((key) => key.startsWith("utm_"))
      .forEach((key) => url.searchParams.delete(key));
    return url.toString();
  } catch {
    return raw;
  }
}

// Everything the email report popup shows for one blog post.
export async function postEmailReport(postId: string): Promise<PostEmailReport | null> {
  const [post] = (await db(
    `blog_posts?select=id,slug,title,status,published_at&id=eq.${encodeURIComponent(postId)}&limit=1`,
  )) as Post[];
  if (!post) return null;

  const campaigns = (
    await dbAll("newsletter_campaigns?select=id,post_id,post_url&order=created_at.asc,id.asc")
  ).filter((campaign) => belongsToPost(campaign, post));
  const ids = campaigns.map((campaign) => String(campaign.id));
  const [deliveries, events] = ids.length
    ? await Promise.all([
        dbAll(
          `newsletter_deliveries?select=id,email,status,sent_at,resend_id&campaign_id=in.${inList(ids)}&order=created_at.asc,queue_position.asc,id.asc`,
        ),
        dbAll(
          `newsletter_events?select=delivery_id,event_type,url,occurred_at&campaign_id=in.${inList(ids)}&order=occurred_at.asc,id.asc`,
        ),
      ])
    : [[], []];

  const activity = new Map<string, { opened?: string; clicked?: string; clicks: number }>();
  const links = new Map<string, { clicks: number; people: Set<string> }>();
  for (const event of events) {
    const deliveryId = String(event.delivery_id);
    const entry = activity.get(deliveryId) || { clicks: 0 };
    const at = String(event.occurred_at);
    entry.opened ||= at;
    if (event.event_type === "click") {
      entry.clicks += 1;
      entry.clicked ||= at;
      const link = cleanLink(String(event.url || ""));
      if (link) {
        const stats = links.get(link) || { clicks: 0, people: new Set<string>() };
        stats.clicks += 1;
        stats.people.add(deliveryId);
        links.set(link, stats);
      }
    }
    activity.set(deliveryId, entry);
  }

  const recipients: PostEmailRecipient[] = deliveries.map((delivery) => {
    const entry = activity.get(String(delivery.id));
    return {
      email: String(delivery.email),
      status:
        delivery.status === "sent" ? "sent" : delivery.status === "skipped" ? "skipped" : "waiting",
      sentAt: delivery.sent_at ? String(delivery.sent_at) : null,
      openedAt: entry?.opened || null,
      clickedAt: entry?.clicked || null,
      clicks: entry?.clicks || 0,
      tracked: Boolean(delivery.resend_id),
    };
  });

  return {
    title: post.title,
    postStatus:
      post.status === "draft"
        ? "draft"
        : post.published_at && Date.parse(post.published_at) > Date.now()
          ? "scheduled"
          : "published",
    publishedAt: post.published_at,
    summary: summarise(
      deliveries.map((delivery) => ({
        status: String(delivery.status),
        opened: Boolean(activity.get(String(delivery.id))),
        clicked: Boolean(activity.get(String(delivery.id))?.clicked),
      })),
    ),
    recipients,
    links: Array.from(links, ([url, stats]) => ({
      url,
      clicks: stats.clicks,
      people: stats.people.size,
    })).sort((a, b) => b.people - a.people || b.clicks - a.clicks),
    untracked: recipients.filter((recipient) => recipient.status === "sent" && !recipient.tracked)
      .length,
  };
}

function resendDate(value: unknown) {
  // Resend returns dates like "2026-09-11 10:13:42.67+00".
  return new Date(String(value).replace(" ", "T").replace(/\+00$/, "Z")).getTime();
}

// Addresses that already received an email with this subject (checked in Resend,
// which also covers sends from before the queue existed) or are queued for it.
export async function emailsAlreadyReceived(subject: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Resend is not configured.");
  const received = new Set<string>();
  const since = Date.now() - 14 * dayMs;
  let after = "";

  for (let page = 0; page < 40; page += 1) {
    if (page) await pause(600);
    const response = await fetch(
      `https://api.resend.com/emails?limit=100${after ? `&after=${encodeURIComponent(after)}` : ""}`,
      { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" },
    );
    const body = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(
        `Could not check in Resend who already received this post: ${body.message || response.statusText}. Nothing was sent.`,
      );
    const emails: Row[] = Array.isArray(body.data) ? body.data : [];
    for (const email of emails) {
      if (email.subject !== subject || !Array.isArray(email.to)) continue;
      email.to.forEach((address) => received.add(String(address).toLowerCase()));
    }
    const last = emails[emails.length - 1];
    if (!body.has_more || !last || resendDate(last.created_at) < since) break;
    after = String(last.id);
  }

  const campaigns = await db(
    `newsletter_campaigns?select=id&title=eq.${encodeURIComponent(subject)}`,
  );
  if (campaigns.length) {
    const queued = await dbAll(
      `newsletter_deliveries?select=email&status=in.(pending,sending,sent)&campaign_id=in.${inList(campaigns.map((campaign) => String(campaign.id)))}&order=id.asc`,
    );
    queued.forEach((row) => received.add(String(row.email).toLowerCase()));
  }
  return received;
}
