import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { db, dbAll } from "@/lib/email-store";
import { addTopics, cleanTopics, removeTopics, sameTopics } from "@/lib/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authorised(password?: string) {
  return Boolean(
    process.env.COMPOSE_PASSWORD && password === process.env.COMPOSE_PASSWORD,
  );
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
        const existingTopics = Array.isArray(current.topics)
          ? current.topics.map(String)
          : [];
        const merged = addTopics(existingTopics, topics);
        if (sameTopics(merged, existingTopics)) {
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

      const now = new Date().toISOString();
      const changes: Record<string, unknown> = { updated_at: now };
      if (payload.tier === "free" || payload.tier === "paid") changes.tier = payload.tier;
      if (payload.status === "active" || payload.status === "unsubscribed")
        changes.status = payload.status;

      // "replace" sets the list outright. "add" and "remove" depend on what each
      // subscriber already has, so those are resolved per row further down.
      let topics: string[] = [];
      let topicMode: "replace" | "add" | "remove" = "replace";
      if (payload.topics !== undefined) {
        topics = cleanTopics(payload.topics);
        if (!topics.length)
          return NextResponse.json({ error: "Choose a valid topic." }, { status: 400 });
        if (payload.topicMode === "add" || payload.topicMode === "remove")
          topicMode = payload.topicMode;
        if (topicMode === "replace") changes.topics = topics;
      }

      const hasFlatChanges = Object.keys(changes).length > 1;
      if (hasFlatChanges)
        await forEachChunk(ids, (filter) =>
          db(`newsletter_subscribers?${filter}`, {
            method: "PATCH",
            body: JSON.stringify(changes),
          }),
        );

      let skipped = 0;
      if (topics.length && topicMode !== "replace") {
        const current = new Map<string, string[]>();
        await forEachChunk(ids, async (filter) => {
          const rows = await db(`newsletter_subscribers?select=id,topics&${filter}`);
          for (const row of rows)
            current.set(
              String(row.id),
              Array.isArray(row.topics) ? row.topics.map(String) : [],
            );
        });

        // Rows that land on the same list are patched together.
        const grouped = new Map<string, string[]>();
        for (const [id, existing] of Array.from(current)) {
          const next =
            topicMode === "add"
              ? addTopics(existing, topics)
              : removeTopics(existing, topics);
          // Removing a subscriber's last topic would leave them subscribed to
          // nothing while still marked active, so leave those untouched.
          if (!next.length) {
            skipped += 1;
            continue;
          }
          if (sameTopics(next, existing)) continue;
          const key = JSON.stringify(next);
          grouped.set(key, [...(grouped.get(key) || []), id]);
        }

        for (const [key, groupIds] of Array.from(grouped))
          await forEachChunk(groupIds, (filter) =>
            db(`newsletter_subscribers?${filter}`, {
              method: "PATCH",
              body: JSON.stringify({ topics: JSON.parse(key), updated_at: now }),
            }),
          );
      }

      return NextResponse.json({ ok: true, count: ids.length, skipped });
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
