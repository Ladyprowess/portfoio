import { NextResponse } from "next/server";
import { db } from "@/lib/email-store";
import { cleanTopics, newsletterTopics } from "@/lib/newsletter";

async function findByToken(token: string) {
  const [subscriber] = await db(
    `newsletter_subscribers?select=id,email,status,topics&unsubscribe_token=eq.${encodeURIComponent(token)}&limit=1`,
  );
  return subscriber || null;
}

function topicsOf(subscriber: Record<string, unknown>) {
  return Array.isArray(subscriber.topics) ? subscriber.topics.map(String) : [];
}

async function patch(id: string, changes: Record<string, unknown>) {
  await db(`newsletter_subscribers?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ ...changes, updated_at: new Date().toISOString() }),
  });
}

// Serves the preferences page and the one-click unsubscribe button in Gmail,
// Yahoo and Apple Mail, which posts "List-Unsubscribe=One-Click" to the
// List-Unsubscribe URL with the token in the query string.
export async function POST(request: Request) {
  try {
    const body = await request.text();
    let payload: Record<string, unknown> = {};
    try {
      payload = body ? JSON.parse(body) : {};
    } catch {
      // A one-click request is form-encoded, not JSON.
    }

    let token = new URL(request.url).searchParams.get("token") || "";
    if (!token) token = String(payload.token || "");
    token = token.trim();
    if (!token)
      return NextResponse.json(
        { error: "This unsubscribe link is incomplete." },
        { status: 400 },
      );

    const subscriber = await findByToken(token);
    if (!subscriber)
      return NextResponse.json(
        {
          error:
            "This unsubscribe link is not valid. Please use the link from your most recent email.",
        },
        { status: 404 },
      );

    // The token is a capability, so anything it returns stays limited to this
    // one subscriber's own preferences.
    const action = String(payload.action || "unsubscribe");

    if (action === "load") {
      return NextResponse.json({
        ok: true,
        email: String(subscriber.email),
        status: String(subscriber.status),
        topics: topicsOf(subscriber),
        choices: [...newsletterTopics],
      });
    }

    if (action === "save") {
      const topics = cleanTopics(payload.topics);
      // Clearing every topic is the same request as leaving the list.
      if (!topics.length) {
        await patch(String(subscriber.id), { status: "unsubscribed" });
        return NextResponse.json({ ok: true, topics: [], status: "unsubscribed" });
      }
      await patch(String(subscriber.id), { topics, status: "active" });
      return NextResponse.json({ ok: true, topics, status: "active" });
    }

    if (subscriber.status === "unsubscribed")
      return NextResponse.json({ ok: true, alreadyUnsubscribed: true });

    await patch(String(subscriber.id), { status: "unsubscribed" });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update this subscription.",
      },
      { status: 500 },
    );
  }
}
