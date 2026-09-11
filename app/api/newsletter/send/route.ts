import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db, dbAll } from "@/lib/email-store";
import {
  emailDocument,
  senderName,
  type NewsletterSubscriber,
} from "@/lib/newsletter";
import { makeBlogSlug } from "@/lib/blog-cms";
import {
  campaignProgress,
  emailsAlreadyReceived,
  postEmailReport,
  postEmailSummaries,
  processNewsletterQueue,
  queueCampaign,
  queueStatus,
} from "@/lib/newsletter-queue";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorised(password?: string) {
  return Boolean(
    process.env.COMPOSE_PASSWORD && password === process.env.COMPOSE_PASSWORD,
  );
}

function cleanHtml(input: string) {
  return input
    .replace(
      /<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      "",
    )
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (!authorised(payload.password))
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    if (payload.action === "queue-status")
      return NextResponse.json(await queueStatus());
    if (payload.action === "process-queue")
      return NextResponse.json({ ok: true, ...(await processNewsletterQueue()) });
    if (payload.action === "email-summaries")
      return NextResponse.json({ summaries: await postEmailSummaries() });
    if (payload.action === "email-report") {
      const report = await postEmailReport(String(payload.postId || ""));
      return report
        ? NextResponse.json(report)
        : NextResponse.json({ error: "This post could not be found." }, { status: 404 });
    }
    if (!process.env.RESEND_API_KEY)
      return NextResponse.json(
        { error: "Resend is not configured." },
        { status: 500 },
      );

    const title = String(payload.title || "").trim();
    const excerpt = String(payload.excerpt || "").trim();
    const contentHtml = cleanHtml(String(payload.contentHtml || ""));
    const topic = String(payload.topic || "Technology");
    if (!title || !excerpt || !contentHtml)
      return NextResponse.json(
        { error: "Add the title, summary, and article before sending." },
        { status: 400 },
      );
    const from = `${senderName(topic)} <hello@ladyprowess.com>`;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://ladyprowess.com";
    const postSlug = makeBlogSlug(String(payload.slug || title));
    const postUrl = `${siteUrl}/blog/${encodeURIComponent(postSlug)}`;

    if (payload.action === "test") {
      const recipient = String(payload.email || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient))
        return NextResponse.json(
          { error: "Enter a valid test email." },
          { status: 400 },
        );
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from,
        to: recipient,
        replyTo: "hello@ladyprowess.com",
        subject: `[Test] ${title}`,
        html: emailDocument({
          title,
          excerpt,
          contentHtml,
          topic,
          postUrl,
          unsubscribeUrl: `${siteUrl}/unsubscribe?preview=1`,
        }),
      });
      if (error)
        return NextResponse.json({ error: error.message }, { status: 502 });
      return NextResponse.json({ ok: true, count: 1 });
    }

    if (payload.action !== "send" && payload.action !== "catch-up")
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });

    const postId = String(payload.postId || "").trim();
    const scheduled =
      typeof payload.publishedAt === "string" &&
      Date.parse(payload.publishedAt) > Date.now();

    // Publishing, rescheduling, or re-saving a post that already has a newsletter
    // must never email anyone twice, so its existing queue is reused.
    let campaignIds: string[] = [];
    if (payload.action === "send" && postId)
      campaignIds = (
        await db(`newsletter_campaigns?select=id&post_id=eq.${encodeURIComponent(postId)}`)
      ).map((row) => String(row.id));

    if (!campaignIds.length) {
      const tier =
        payload.tier === "paid" || payload.tier === "free" ? payload.tier : "all";
      const rows = (await dbAll(
        "newsletter_subscribers?select=*&status=eq.active&order=created_at.asc,id.asc",
      )) as NewsletterSubscriber[];
      const subscribers = rows.filter(
        (subscriber) =>
          (topic === "All" ||
            subscriber.topics.includes("All") ||
            subscriber.topics.includes(topic)) &&
          (tier === "all" || subscriber.tier === tier),
      );
      // "catch-up" emails a published post only to subscribers who have not had it yet.
      const exclude =
        payload.action === "catch-up" ? await emailsAlreadyReceived(title) : undefined;
      const { campaignId, queued } = await queueCampaign({
        title,
        excerpt,
        contentHtml,
        topic,
        postUrl,
        postId: postId || undefined,
        subscribers,
        exclude,
      });
      if (!queued)
        return NextResponse.json({ ok: true, count: 0, sent: 0, waiting: 0 });
      campaignIds = [campaignId];
    }

    const run = await processNewsletterQueue();
    const progress = await campaignProgress(campaignIds);
    return NextResponse.json({
      ok: true,
      count: progress.total,
      sent: progress.sent,
      waiting: progress.waiting,
      scheduled,
      problem: run.problem,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not send the newsletter.",
      },
      { status: 500 },
    );
  }
}
