import { Resend } from "resend";
import { db } from "./email-store";
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

type Row = Record<string, unknown>;

type Campaign = {
  id: string;
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

export type QueueRunResult = {
  sent: number;
  waiting: number;
  problem?: string;
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const inList = (ids: string[]) =>
  `(${Array.from(new Set(ids)).map(encodeURIComponent).join(",")})`;

function updateDeliveries(ids: string[], patch: Row) {
  return db(`newsletter_deliveries?id=in.${inList(ids)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

async function waitingCount() {
  return (await db("newsletter_deliveries?select=id&status=in.(pending,sending)"))
    .length;
}

async function sentInLast24Hours() {
  const since = encodeURIComponent(new Date(Date.now() - dayMs).toISOString());
  const [newsletters, composed] = await Promise.all([
    db(`newsletter_deliveries?select=id&status=eq.sent&sent_at=gte.${since}`),
    db(`sent_emails?select=id&status=eq.sent&sent_at=gte.${since}`).catch(() => []),
  ]);
  return newsletters.length + composed.length;
}

// Subscribers who were still waiting an hour after the previous newsletter was
// queued go to the front this time, so the same people are not always last.
async function subscribersWhoWaitedLastTime() {
  const [last] = await db(
    "newsletter_campaigns?select=id,created_at&order=created_at.desc&limit=1",
  );
  if (!last) return new Set<string>();
  const cutoff = new Date(String(last.created_at)).getTime() + 60 * 60 * 1000;
  const rows = await db(
    `newsletter_deliveries?select=subscriber_id,status,sent_at&campaign_id=eq.${encodeURIComponent(String(last.id))}`,
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

  // A few extra rows are read so people who unsubscribed do not use up today's slots.
  const pending = (await db(
    `newsletter_deliveries?select=id,campaign_id,subscriber_id&status=eq.pending&order=created_at.asc,queue_position.asc&limit=${allowance + 50}`,
  )) as Delivery[];
  if (!pending.length) return { sent: 0, waiting: await waitingCount() };

  const [campaignRows, subscriberRows] = await Promise.all([
    db(`newsletter_campaigns?select=*&id=in.${inList(pending.map((d) => d.campaign_id))}`),
    db(
      `newsletter_subscribers?select=id,email,status,unsubscribe_token&id=in.${inList(pending.map((d) => d.subscriber_id))}`,
    ),
  ]);
  const campaigns = new Map(
    (campaignRows as Campaign[]).map((campaign) => [campaign.id, campaign]),
  );
  const subscribers = new Map(
    (subscriberRows as NewsletterSubscriber[]).map((subscriber) => [
      subscriber.id,
      subscriber,
    ]),
  );

  // People who unsubscribed while waiting are dropped from the queue.
  const active = (delivery: Delivery) =>
    campaigns.has(delivery.campaign_id) &&
    subscribers.get(delivery.subscriber_id)?.status === "active";
  const skipped = pending.filter((delivery) => !active(delivery));
  const ready = pending.filter(active).slice(0, allowance);
  if (skipped.length)
    await updateDeliveries(
      skipped.map((delivery) => delivery.id),
      { status: "skipped" },
    );

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ladyprowess.com";
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
    try {
      const { error } = await resend.batch.send(
        chunk.map((delivery) => {
          const campaign = campaigns.get(delivery.campaign_id) as Campaign;
          const subscriber = subscribers.get(
            delivery.subscriber_id,
          ) as NewsletterSubscriber;
          return {
            from: `${senderName(campaign.topic)} <${sender}>`,
            to: [subscriber.email],
            replyTo: sender,
            subject: campaign.title,
            html: emailDocument({
              title: campaign.title,
              excerpt: campaign.excerpt,
              contentHtml: campaign.content_html,
              topic: campaign.topic,
              postUrl: campaign.post_url || undefined,
              unsubscribeUrl: `${siteUrl}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`,
            }),
          };
        }),
      );
      failure = error;
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

    await updateDeliveries(ids, {
      status: "sent",
      sent_at: new Date().toISOString(),
      error: null,
    });
    sent += chunk.length;
  }

  return { sent, waiting: await waitingCount(), problem };
}

export async function campaignProgress(campaignId: string) {
  const rows = await db(
    `newsletter_deliveries?select=status&campaign_id=eq.${encodeURIComponent(campaignId)}`,
  );
  return {
    sent: rows.filter((row) => row.status === "sent").length,
    waiting: rows.filter((row) => row.status === "pending" || row.status === "sending")
      .length,
  };
}

export async function queueStatus() {
  const [waiting, usedToday] = await Promise.all([
    db("newsletter_deliveries?select=campaign_id&status=in.(pending,sending)"),
    sentInLast24Hours(),
  ]);
  const ids = waiting.map((row) => String(row.campaign_id));
  const campaigns = ids.length
    ? await db(
        `newsletter_campaigns?select=id,title,created_at&id=in.${inList(ids)}&order=created_at.asc`,
      )
    : [];
  return {
    waiting: waiting.length,
    usedToday,
    dailyAllowance: newsletterDailyAllowance,
    campaigns: campaigns.map((campaign) => ({
      id: String(campaign.id),
      title: String(campaign.title),
      createdAt: String(campaign.created_at),
      waiting: ids.filter((id) => id === campaign.id).length,
    })),
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
    const queued = await db(
      `newsletter_deliveries?select=email&status=in.(pending,sending,sent)&campaign_id=in.${inList(campaigns.map((campaign) => String(campaign.id)))}`,
    );
    queued.forEach((row) => received.add(String(row.email).toLowerCase()));
  }
  return received;
}
