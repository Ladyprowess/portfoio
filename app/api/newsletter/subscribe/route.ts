import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/email-store";
import { addTopics, cleanTopics } from "@/lib/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const name = String(payload.name || "").trim() || null;
    const topics = cleanTopics(payload.topics);
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
      `newsletter_subscribers?select=id,tier,topics,name&email=eq.${encodeURIComponent(email)}&limit=1`,
    );
    if (existing[0]?.id) {
      // Add to what they already receive rather than replacing it. Someone who
      // signed up for Web3 and later subscribes from an AI post should get both.
      const current = Array.isArray(existing[0].topics)
        ? existing[0].topics.map(String)
        : [];
      await db(
        `newsletter_subscribers?id=eq.${encodeURIComponent(String(existing[0].id))}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: name || existing[0].name || null,
            topics: addTopics(current, topics),
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
