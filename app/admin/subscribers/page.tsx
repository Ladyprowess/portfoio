"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AdminNav from "@/components/AdminNav";
import NewsletterQueuePanel from "@/components/NewsletterQueuePanel";
import {
  addTopics,
  newsletterTopics,
  removeTopics,
  type NewsletterSubscriber,
} from "@/lib/newsletter";

const PAGE_SIZE = 10;

// Topic pills are a set editor. "All" is a wildcard: unticking it expands to the
// concrete list, and unticking one topic while on "All" does the same minus that
// topic. A subscriber is never left with nothing, which the API would reject.
function toggleTopic(current: string[], topic: string): string[] {
  const has = current.includes("All") || current.includes(topic);
  const next = has ? removeTopics(current, [topic]) : addTopics(current, [topic]);
  return next.length ? next : current;
}

type ImportRow = { email: string; name: string; tier: "free" | "paid" };
type StatusFilter = "all" | "active" | "unsubscribed";

function parseCsv(text: string): ImportRow[] | null {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
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
  if (emailIndex < 0) return null;
  return lines
    .map((line) => {
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
        email: columns[emailIndex] || "",
        name: nameIndex >= 0 ? columns[nameIndex] || "" : "",
        tier:
          typeIndex >= 0 && /paid/i.test(columns[typeIndex] || "")
            ? ("paid" as const)
            : ("free" as const),
      };
    })
    .filter((row) => row.email);
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export default function SubscribersPage() {
  const [password, setPassword] = useState("");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All records");
  const [topicMode, setTopicMode] = useState<"add" | "remove" | "replace">("add");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importFileName, setImportFileName] = useState("");
  const [importTopics, setImportTopics] = useState<string[]>(["All"]);
  const [importError, setImportError] = useState("");
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

  useEffect(() => {
    const saved = sessionStorage.getItem("ladyprowess_admin_password") || "";
    setPassword(saved);
    if (saved) load(saved);
    // The initial load intentionally runs once with the password stored by the admin login.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeFilter(apply: () => void) {
    apply();
    setPage(1);
    setSelected(new Set());
  }

  async function chooseFile(file?: File) {
    if (!file) return;
    const rows = parseCsv(await file.text());
    if (fileRef.current) fileRef.current.value = "";
    setImportFileName(file.name);
    setImportRows(rows || []);
    setImportError(
      !rows
        ? "The CSV must contain an email column."
        : rows.length
          ? ""
          : "No subscriber emails were found in this file.",
    );
  }

  function toggleImportTopic(value: string) {
    if (value === "All") return setImportTopics(["All"]);
    setImportTopics((current) => {
      const withoutAll = current.filter((item) => item !== "All");
      return withoutAll.includes(value)
        ? withoutAll.filter((item) => item !== value)
        : [...withoutAll, value];
    });
  }

  function closeImport() {
    setImportOpen(false);
    setImportRows([]);
    setImportFileName("");
    setImportError("");
    setImportTopics(["All"]);
  }

  async function runImport() {
    if (!importRows.length || !importTopics.length) return;
    setBusy(true);
    try {
      const data = await request({
        action: "import",
        subscribers: importRows,
        topics: importTopics,
      });
      const parts = [`${plural(data.added, "new subscriber")} added`];
      if (data.updated)
        parts.push(`${plural(data.updated, "existing subscriber")} got the new topic`);
      if (data.unchanged) parts.push(`${data.unchanged} already had it`);
      if (data.invalid)
        parts.push(`${plural(data.invalid, "row")} skipped because the email was not valid`);
      setMessage(`${parts.join(", ")}.`);
      closeImport();
      await load();
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Could not import subscribers.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function update(
    subscriber: NewsletterSubscriber,
    changes: Partial<NewsletterSubscriber>,
  ) {
    try {
      await request({
        action: "update",
        id: subscriber.id,
        topics: changes.topics ?? subscriber.topics,
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

  async function bulkUpdate(
    changes: {
      topics?: string[];
      topicMode?: "add" | "remove" | "replace";
      tier?: "free" | "paid";
      status?: "unsubscribed";
    },
    done: string,
  ) {
    const ids = Array.from(selected);
    if (!ids.length) return;
    setBusy(true);
    try {
      const result = await request({ action: "update", ids, ...changes });
      const skipped = Number(result?.skipped) || 0;
      setMessage(
        `${plural(ids.length - skipped, "subscriber")} ${done}.` +
          (skipped
            ? ` ${plural(skipped, "subscriber")} skipped — that was their only topic.`
            : ""),
      );
      setSelected(new Set());
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update subscribers.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(ids: string[]) {
    if (!ids.length) return;
    const who =
      ids.length === 1
        ? subscribers.find((item) => item.id === ids[0])?.email || "this subscriber"
        : plural(ids.length, "subscriber");
    if (
      !window.confirm(
        `Delete ${who}? This cannot be undone, and their email history is removed from your reports. To keep their history, mark them as unsubscribed instead.`,
      )
    )
      return;
    setBusy(true);
    try {
      await request({ action: "delete", ids });
      setMessage(`${who} deleted.`);
      setSelected((current) => new Set(Array.from(current).filter((id) => !ids.includes(id))));
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete subscribers.",
      );
    } finally {
      setBusy(false);
    }
  }

  const counts = useMemo(
    () => ({
      active: subscribers.filter((item) => item.status === "active").length,
      unsubscribed: subscribers.filter((item) => item.status === "unsubscribed").length,
    }),
    [subscribers],
  );

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
          (tier === "all" || item.tier === tier) &&
          (status === "all" || item.status === status),
      ),
    [subscribers, query, topic, tier, status],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const visibleIds = visible.map((item) => item.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  function toggleVisible() {
    setSelected((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => (allVisibleSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
            <button
              onClick={() => setImportOpen(true)}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary"
            >
              Import CSV
            </button>
          </div>
        </div>
        {message && (
          <p className="mt-6 rounded-xl bg-surface px-4 py-3 text-sm text-muted" role="status">
            {message}
          </p>
        )}
        <NewsletterQueuePanel password={password} />
        <div className="mt-7 grid gap-3 rounded-2xl border border-ink-border bg-surface p-3 md:grid-cols-[1fr_200px_150px_190px]">
          <input
            value={query}
            onChange={(event) => changeFilter(() => setQuery(event.target.value))}
            placeholder="Search email or name"
            aria-label="Search subscribers"
            className="rounded-xl bg-bg px-4 py-3 text-sm outline-none"
          />
          <select
            value={topic}
            onChange={(event) => changeFilter(() => setTopic(event.target.value))}
            aria-label="Filter by topic"
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
            onChange={(event) => changeFilter(() => setTier(event.target.value))}
            aria-label="Filter by tier"
            className="rounded-xl bg-bg px-4 py-3 text-sm"
          >
            <option value="all">All tiers</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={status}
            onChange={(event) =>
              changeFilter(() => setStatus(event.target.value as StatusFilter))
            }
            aria-label="Filter by status"
            className="rounded-xl bg-bg px-4 py-3 text-sm"
          >
            <option value="all">All statuses ({subscribers.length})</option>
            <option value="active">Subscribed ({counts.active})</option>
            <option value="unsubscribed">Unsubscribed ({counts.unsubscribed})</option>
          </select>
        </div>
        <p className="mt-4 px-1 text-xs text-muted">
          Showing {filtered.length} of {plural(subscribers.length, "subscriber")} ·{" "}
          {counts.active} subscribed · {counts.unsubscribed} unsubscribed
        </p>

        {selected.size > 0 && (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/[0.05] p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3 px-1 text-sm">
              <span className="font-semibold">{selected.size} selected</span>
              {selected.size < filtered.length && (
                <button
                  type="button"
                  onClick={() => setSelected(new Set(filtered.map((item) => item.id)))}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Select all {filtered.length} matching
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-muted underline underline-offset-4"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Topics are a set, so bulk edits say what to do with one topic
                  rather than overwriting everyone's whole list. */}
              <select
                disabled={busy}
                value={topicMode}
                onChange={(event) =>
                  setTopicMode(event.target.value as "add" | "remove" | "replace")
                }
                aria-label="What to do with the chosen topic"
                className="rounded-full border border-ink-border bg-surface px-3 py-2 text-xs font-semibold disabled:opacity-50"
              >
                <option value="add">Add topic…</option>
                <option value="remove">Remove topic…</option>
                <option value="replace">Replace topics with…</option>
              </select>
              <select
                disabled={busy}
                value=""
                onChange={(event) => {
                  const topic = event.target.value;
                  if (!topic) return;
                  const done =
                    topicMode === "add"
                      ? `subscribed to ${topic}`
                      : topicMode === "remove"
                        ? `removed from ${topic}`
                        : `moved to ${topic}`;
                  bulkUpdate({ topics: [topic], topicMode }, done);
                }}
                aria-label="Topic to apply to selected subscribers"
                className="rounded-full border border-ink-border bg-surface px-3 py-2 text-xs font-semibold disabled:opacity-50"
              >
                <option value="">Choose topic…</option>
                <option value="All">All</option>
                {newsletterTopics.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                disabled={busy}
                value=""
                onChange={(event) =>
                  event.target.value &&
                  bulkUpdate(
                    { tier: event.target.value as "free" | "paid" },
                    `changed to ${event.target.value}`,
                  )
                }
                aria-label="Change tier for selected subscribers"
                className="rounded-full border border-ink-border bg-surface px-3 py-2 text-xs font-semibold disabled:opacity-50"
              >
                <option value="">Change tier…</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              <button
                type="button"
                disabled={busy}
                onClick={() => bulkUpdate({ status: "unsubscribed" }, "marked as unsubscribed")}
                className="rounded-full border border-ink-border bg-surface px-3 py-2 text-xs font-semibold disabled:opacity-50"
              >
                Mark unsubscribed
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(Array.from(selected))}
                className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-on-primary disabled:opacity-50"
              >
                Delete selected
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-border bg-surface">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleVisible}
                    disabled={!visible.length}
                    aria-label="Select everyone on this page"
                    className="h-4 w-4 accent-primary"
                  />
                </th>
                <th className="p-4">Subscriber</th>
                <th className="p-4">Topics</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4">Source</th>
                <th className="p-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr
                  key={item.id}
                  className={`border-t border-ink-border ${selected.has(item.id) ? "bg-primary/[0.04]" : ""}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleOne(item.id)}
                      aria-label={`Select ${item.email}`}
                      className="h-4 w-4 accent-primary"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-semibold">{item.email}</p>
                    <p className="text-xs text-muted">
                      {item.name || "No name"}
                    </p>
                  </td>
                  <td className="p-4">
                    {/* Topics are a set, so they are edited as toggles. A single
                        dropdown here used to overwrite every other topic the
                        subscriber had. */}
                    <div className="flex flex-wrap gap-1.5">
                      {["All", ...newsletterTopics].map((value) => {
                        const on = item.topics.includes("All") || item.topics.includes(value);
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => update(item, { topics: toggleTopic(item.topics, value) })}
                            aria-pressed={on}
                            title={on ? `Remove ${value}` : `Add ${value}`}
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${on ? "border-primary bg-primary text-on-primary" : "border-ink-border text-muted hover:border-primary/50 hover:text-parchment"}`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
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
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => remove([item.id])}
                      aria-label={`Delete ${item.email}`}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
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

      {importOpen && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-title"
          onKeyDown={(event) => event.key === "Escape" && !busy && closeImport()}
          onClick={(event) => event.target === event.currentTarget && !busy && closeImport()}
        >
          <div className="mx-auto max-w-lg rounded-3xl bg-surface p-6 shadow-2xl md:p-8">
            <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">
              Import subscribers
            </p>
            <h2 id="import-title" className="mt-2 font-display text-2xl font-semibold">
              Import a CSV file
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use a Substack export or any CSV with an email column. Names and a
              paid or free column are picked up if the file has them.
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold">1. Choose the file</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => chooseFile(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 w-full rounded-2xl border border-dashed border-ink-border px-4 py-5 text-sm hover:border-primary"
              >
                {importFileName ? (
                  <>
                    <span className="block font-semibold">{importFileName}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {plural(importRows.length, "subscriber")} found · choose a different file
                    </span>
                  </>
                ) : (
                  "Choose a CSV file"
                )}
              </button>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">
                2. Which newsletters should they receive?
              </legend>
              <p className="mt-1 text-xs leading-5 text-muted">
                &quot;All&quot; means every newsletter. Pick one or more topics to send them
                only those.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["All", ...newsletterTopics].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={importTopics.includes(value)}
                    onClick={() => toggleImportTopic(value)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold ${importTopics.includes(value) ? "border-primary bg-primary text-on-primary" : "border-ink-border bg-surface text-muted hover:border-primary"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="mt-5 rounded-xl bg-surface-2 px-4 py-3 text-xs leading-5 text-muted">
              People already on your list are not added twice. They keep their
              current status, so anyone who unsubscribed stays unsubscribed, and the
              topics you pick are added to the ones they already have.
            </p>
            {importError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {importError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={busy || !importRows.length || !importTopics.length}
                onClick={runImport}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary disabled:opacity-50"
              >
                {busy
                  ? "Importing..."
                  : importRows.length
                    ? `Import ${plural(importRows.length, "subscriber")}`
                    : "Import subscribers"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={closeImport}
                className="rounded-full border border-ink-border px-6 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
