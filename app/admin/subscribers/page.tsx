"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminNav from "@/components/AdminNav";
import NewsletterQueuePanel from "@/components/NewsletterQueuePanel";
import { newsletterTopics, type NewsletterSubscriber } from "@/lib/newsletter";

const PAGE_SIZE = 10;

export default function SubscribersPage() {
  const [password, setPassword] = useState("");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All records");
  const [tier, setTier] = useState("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function request(
    payload: Record<string, unknown>,
    savedPassword = password,
  ) {
    const response = await fetch("/api/newsletter/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, password: savedPassword }),
    });
    const text = await response.text();
    let data: Record<string, any> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        response.status === 413
          ? "The import file is too large. Divide it into smaller CSV files."
          : "The server returned an invalid response.",
      );
    }
    if (!response.ok)
      throw new Error(data.error || "Could not manage subscribers.");
    return data;
  }

  async function load(savedPassword = password) {
    try {
      const data = await request({ action: "list" }, savedPassword);
      setSubscribers(data.subscribers || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load subscribers.",
      );
    }
  }

  // The initial load intentionally runs once with the password stored by the admin login.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const saved = sessionStorage.getItem("ladyprowess_admin_password") || "";
    setPassword(saved);
    if (saved) load(saved);
  }, []);

  async function importCsv(file?: File) {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers =
      lines
        .shift()
        ?.split(",")
        .map((value) => value.trim().replace(/^"|"$/g, "").toLowerCase()) || [];
    const emailIndex = headers.findIndex((value) => value.includes("email"));
    const nameIndex = headers.findIndex((value) => value.includes("name"));
    const typeIndex = headers.findIndex(
      (value) => value.includes("type") || value.includes("tier"),
    );
    if (emailIndex < 0)
      return setMessage("The CSV must contain an email column.");
    const rows = lines.map((line) => {
      const columns =
        line
          .match(/("[^"]*(?:""[^"]*)*"|[^,]*)(?:,|$)/g)
          ?.map((value) =>
            value
              .replace(/,$/, "")
              .replace(/^"|"$/g, "")
              .replace(/""/g, '"')
              .trim(),
          ) || [];
      return {
        email: columns[emailIndex],
        name: nameIndex >= 0 ? columns[nameIndex] : "",
        tier:
          typeIndex >= 0 && /paid/i.test(columns[typeIndex] || "")
            ? "paid"
            : "free",
        topics: ["Web3"],
        source: "Substack import",
      };
    });
    try {
      const data = await request({ action: "import", subscribers: rows });
      setMessage(`${data.count} subscribers imported.`);
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not import subscribers.",
      );
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function update(
    subscriber: NewsletterSubscriber,
    changes: Partial<NewsletterSubscriber>,
  ) {
    try {
      await request({
        action: "update",
        id: subscriber.id,
        topics: changes.topics || subscriber.topics,
        tier: changes.tier || subscriber.tier,
        status: changes.status || subscriber.status,
      });
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update subscriber.",
      );
    }
  }

  const filtered = useMemo(
    () =>
      subscribers.filter(
        (item) =>
          (!query ||
            item.email.toLowerCase().includes(query.toLowerCase()) ||
            (item.name || "").toLowerCase().includes(query.toLowerCase())) &&
          (topic === "All records" ||
            item.topics.includes("All") ||
            item.topics.includes(topic)) &&
          (tier === "all" || item.tier === tier),
      ),
    [subscribers, query, topic, tier],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (!password)
    return (
      <main className="min-h-screen bg-bg">
        <AdminNav />
        <p className="mx-auto max-w-xl px-5 py-20 text-center">
          Open the admin dashboard first.
        </p>
      </main>
    );
  return (
    <main className="min-h-screen bg-bg">
      <AdminNav />
      <section className="mx-auto max-w-[1240px] px-5 py-10 md:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">
              Newsletter
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold">
              Subscribers
            </h1>
            <p className="mt-2 text-sm text-muted">
              Import your Substack CSV, organise interests, and manage free or
              paid status.
            </p>
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => importCsv(event.target.files?.[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
            >
              Import Substack CSV
            </button>
          </div>
        </div>
        {message && (
          <p className="mt-6 rounded-xl bg-white px-4 py-3 text-sm text-muted">
            {message}
          </p>
        )}
        <NewsletterQueuePanel password={password} />
        <div className="mt-7 grid gap-3 rounded-2xl border border-ink-border bg-white p-3 md:grid-cols-[1fr_220px_160px]">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search email or name"
            className="rounded-xl bg-bg px-4 py-3 text-sm outline-none"
          />
          <select
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              setPage(1);
            }}
            className="rounded-xl bg-bg px-4 py-3 text-sm"
          >
            <option>All records</option>
            <option>All</option>
            {newsletterTopics.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={tier}
            onChange={(event) => {
              setTier(event.target.value);
              setPage(1);
            }}
            className="rounded-xl bg-bg px-4 py-3 text-sm"
          >
            <option value="all">All tiers</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-border bg-white">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="p-4">Subscriber</th>
                <th className="p-4">Topics</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-t border-ink-border">
                  <td className="p-4">
                    <p className="font-semibold">{item.email}</p>
                    <p className="text-xs text-muted">
                      {item.name || "No name"}
                    </p>
                  </td>
                  <td className="p-4">
                    <select
                      value={item.topics[0] || "All"}
                      onChange={(event) =>
                        update(item, { topics: [event.target.value] })
                      }
                      className="rounded-lg border border-ink-border px-3 py-2"
                    >
                      <option>All</option>
                      {newsletterTopics.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={item.tier}
                      onChange={(event) =>
                        update(item, {
                          tier: event.target.value as "free" | "paid",
                        })
                      }
                      className="rounded-lg border border-ink-border px-3 py-2"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={item.status}
                      onChange={(event) =>
                        update(item, {
                          status: event.target.value as
                            | "active"
                            | "unsubscribed",
                        })
                      }
                      className="rounded-lg border border-ink-border px-3 py-2"
                    >
                      <option value="active">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                    </select>
                  </td>
                  <td className="p-4 text-muted">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <p className="p-12 text-center text-muted">No subscribers found.</p>
          )}
        </div>
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              disabled={safePage === 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-full border border-ink-border px-4 py-2 text-sm disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-sm text-muted">
              {safePage} of {totalPages}
            </span>
            <button
              disabled={safePage === totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-full border border-ink-border px-4 py-2 text-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
