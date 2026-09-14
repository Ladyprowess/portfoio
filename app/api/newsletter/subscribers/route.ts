import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { db, dbAll } from "@/lib/email-store";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authorised(password?: string) {
  return Boolean(
    process.env.COMPOSE_PASSWORD && password === process.env.COMPOSE_PASSWORD,
  );
}

function cleanTopics(value: unknown) {
  const topics = Array.isArray(value)
    ? Array.from(
        new Set(
          value
            .map((topic) => String(topic).trim())
            .filter((topic) => topic === "All" || /^[A-Za-z0-9 &]{2,40}$/.test(topic)),
        ),
      )
    : [];
  return topics.includes("All") ? ["All"] : topics;
}

// Returns the new topic list for an existing subscriber, or null if nothing changes.
// Subscribers on "All" already receive every newsletter.
function mergeTopics(current: string[], selected: string[]) {
  if (current.includes("All")) return null;
  const next = selected.includes("All")
    ? ["All"]
    : Array.from(new Set([...current, ...selected]));
  const unchanged =
    next.length === current.length && next.every((topic) => current.includes(topic));
  return unchanged ? null : next;
}

function idList(payload: Record<string, unknown>) {
  const ids = Array.isArray(payload.ids) ? payload.ids : payload.id ? [payload.id] : [];
  return Array.from(new Set(ids.map(String).filter(Boolean)));
}

async function forEachChunk(ids: string[], run: (filter: string) => Promise<unknown>) {
  for (let index = 0; index < ids.length; index += 100)
    await run(`id=in.(${ids.slice(index, index + 100).map(encodeURIComponent).join(",")})`);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (!authorised(payload.password))
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });

    if (payload.action === "list") {
      const subscribers = await dbAll(
        "newsletter_subscribers?select=*&order=created_at.desc,id.asc",
      );
      return NextResponse.json({ subscribers });
    }

    if (payload.action === "import") {
      const topics = cleanTopics(payload.topics);
      if (!topics.length)
        return NextResponse.json(
          { error: "Choose at least one topic for these subscribers." },
          { status: 400 },
        );

      const incoming: Record<string, unknown>[] = Array.isArray(payload.subscribers)
        ? payload.subscribers.slice(0, 5000)
        : [];
      const rows = new Map<string, { email: string; name: string | null; tier: "free" | "paid" }>();
      let invalid = 0;
      for (const row of incoming) {
        const email = String(row?.email || "").trim().toLowerCase();
        if (!emailPattern.test(email)) {
          invalid += 1;
          continue;
        }
        if (!rows.has(email))
          rows.set(email, {
            email,
            name: String(row.name || "").trim() || null,
            tier: row.tier === "paid" ? "paid" : "free",
          });
      }
      if (!rows.size)
        return NextResponse.json(
          { error: "No valid subscriber emails were found." },
          { status: 400 },
        );

      // People already on the list are never duplicated and keep their status and
      // unsubscribe link, so an import cannot re-subscribe someone who left.
      const existing = new Map(
        (await dbAll("newsletter_subscribers?select=id,email,topics&order=id.asc")).map(
          (subscriber) => [String(subscriber.email).toLowerCase(), subscriber],
        ),
      );
      const now = new Date().toISOString();
      const newRows: Record<string, unknown>[] = [];
      const topicUpdates = new Map<string, string[]>();
      let unchanged = 0;
      for (const row of Array.from(rows.values())) {
        const current = existing.get(row.email);
        if (!current) {
          newRows.push({
            ...row,
            topics,
            status: "active",
            source: "CSV import",
            unsubscribe_token: randomUUID(),
            updated_at: now,
          });
          continue;
        }
        const merged = mergeTopics(
          Array.isArray(current.topics) ? current.topics.map(String) : [],
          topics,
        );
        if (!merged) {
          unchanged += 1;
          continue;
        }
        const key = JSON.stringify(merged);
        topicUpdates.set(key, [...(topicUpdates.get(key) || []), String(current.id)]);
      }

      for (let index = 0; index < newRows.length; index += 500)
        await db("newsletter_subscribers", {
          method: "POST",
          body: JSON.stringify(newRows.slice(index, index + 500)),
        });
      let updated = 0;
      for (const [key, ids] of Array.from(topicUpdates)) {
        await forEachChunk(ids, (filter) =>
          db(`newsletter_subscribers?${filter}`, {
            method: "PATCH",
            body: JSON.stringify({ topics: JSON.parse(key), updated_at: now }),
          }),
        );
        updated += ids.length;
      }
      return NextResponse.json({
        ok: true,
        added: newRows.length,
        updated,
        unchanged,
        invalid,
      });
    }

    if (payload.action === "update") {
      const ids = idList(payload);
      if (!ids.length)
        return NextResponse.json({ error: "Choose at least one subscriber." }, { status: 400 });
      const changes: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (payload.topics !== undefined) {
        const topics = cleanTopics(payload.topics);
        if (!topics.length)
          return NextResponse.json({ error: "Choose a valid topic." }, { status: 400 });
        changes.topics = topics;
      }
      if (payload.tier === "free" || payload.tier === "paid") changes.tier = payload.tier;
      if (payload.status === "active" || payload.status === "unsubscribed")
        changes.status = payload.status;
      await forEachChunk(ids, (filter) =>
        db(`newsletter_subscribers?${filter}`, {
          method: "PATCH",
          body: JSON.stringify(changes),
        }),
      );
      return NextResponse.json({ ok: true, count: ids.length });
    }

    if (payload.action === "delete") {
      const ids = idList(payload);
      if (!ids.length)
        return NextResponse.json({ error: "Choose at least one subscriber." }, { status: 400 });
      await forEachChunk(ids, (filter) =>
        db(`newsletter_subscribers?${filter}`, { method: "DELETE" }),
      );
      return NextResponse.json({ ok: true, count: ids.length });
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
