import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/email-store";
import { newsletterTopics } from "@/lib/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const name = String(payload.name || "").trim() || null;
    const selected: string[] = Array.isArray(payload.topics)
      ? payload.topics.map(String)
      : [];
    const topics = Array.from(new Set(selected
      .map((topic) => topic.trim())
      .filter((topic) => topic === "All" || (/^[A-Za-z0-9 &]{2,40}$/.test(topic) && (newsletterTopics.includes(topic as never) || topic.length > 1)))));
    if (!emailPattern.test(email))
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    if (!topics.length)
      return NextResponse.json(
        { error: "Choose at least one topic." },
        { status: 400 },
      );

    const existing = await db(
      `newsletter_subscribers?select=id,tier&email=eq.${encodeURIComponent(email)}&limit=1`,
    );
    if (existing[0]?.id) {
      await db(
        `newsletter_subscribers?id=eq.${encodeURIComponent(String(existing[0].id))}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name,
            topics,
            status: "active",
            updated_at: new Date().toISOString(),
          }),
        },
      );
    } else {
      await db("newsletter_subscribers", {
        method: "POST",
        body: JSON.stringify({
          email,
          name,
          topics,
          tier: "free",
          status: "active",
          source: "website",
          unsubscribe_token: randomUUID(),
          updated_at: new Date().toISOString(),
        }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not complete the subscription.",
      },
      { status: 500 },
    );
  }
}
