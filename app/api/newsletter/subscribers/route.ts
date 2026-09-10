import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/email-store";

function authorised(password?: string) {
  return Boolean(
    process.env.COMPOSE_PASSWORD && password === process.env.COMPOSE_PASSWORD,
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (!authorised(payload.password))
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    if (payload.action === "list") {
      const subscribers = await db(
        "newsletter_subscribers?select=*&order=created_at.desc",
      );
      return NextResponse.json({ subscribers });
    }
    if (payload.action === "import") {
      const rows = Array.isArray(payload.subscribers)
        ? payload.subscribers.slice(0, 2500)
        : [];
      const subscribers = rows
        .map((row: Record<string, unknown>) => ({
          email: String(row.email || "")
            .trim()
            .toLowerCase(),
          name: String(row.name || "").trim() || null,
          topics:
            Array.isArray(row.topics) && row.topics.length
              ? row.topics
              : ["All"],
          tier: row.tier === "paid" ? "paid" : "free",
          status: "active",
          source: String(row.source || "Substack import"),
          unsubscribe_token: randomUUID(),
          updated_at: new Date().toISOString(),
        }))
        .filter((row: { email: string }) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email),
        );
      if (!subscribers.length)
        return NextResponse.json(
          { error: "No valid subscriber emails were found." },
          { status: 400 },
        );
      await db("newsletter_subscribers?on_conflict=email", {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(subscribers),
      });
      return NextResponse.json({ ok: true, count: subscribers.length });
    }
    if (payload.action === "update") {
      await db(
        `newsletter_subscribers?id=eq.${encodeURIComponent(payload.id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            topics: payload.topics,
            tier: payload.tier,
            status: payload.status,
            updated_at: new Date().toISOString(),
          }),
        },
      );
      return NextResponse.json({ ok: true });
    }
    if (payload.action === "delete") {
      await db(
        `newsletter_subscribers?id=eq.${encodeURIComponent(payload.id)}`,
        { method: "DELETE" },
      );
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not manage subscribers.",
      },
      { status: 500 },
    );
  }
}
