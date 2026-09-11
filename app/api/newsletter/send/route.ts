import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/email-store";
import {
  emailDocument,
  senderName,
  type NewsletterSubscriber,
} from "@/lib/newsletter";
import { makeBlogSlug } from "@/lib/blog-cms";

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
    const resend = new Resend(process.env.RESEND_API_KEY);
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

    const tier =
      payload.tier === "paid" || payload.tier === "free" ? payload.tier : "all";
    const rows = (await db(
      "newsletter_subscribers?select=*&status=eq.active",
    )) as NewsletterSubscriber[];
    const subscribers = rows.filter(
      (subscriber) =>
        (topic === "All" ||
          subscriber.topics.includes("All") ||
          subscriber.topics.includes(topic)) &&
        (tier === "all" || subscriber.tier === tier),
    );
    if (!subscribers.length) return NextResponse.json({ ok: true, count: 0 });
    for (let index = 0; index < subscribers.length; index += 100) {
      const batch = subscribers.slice(index, index + 100).map((subscriber) => ({
        from,
        to: [subscriber.email],
        replyTo: "hello@ladyprowess.com",
        subject: title,
        html: emailDocument({
          title,
          excerpt,
          contentHtml,
          topic,
          postUrl,
          unsubscribeUrl: `${siteUrl}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`,
        }),
      }));
      const { error } = await resend.batch.send(batch);
      if (error)
        return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ ok: true, count: subscribers.length });
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
