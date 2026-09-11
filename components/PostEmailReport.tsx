"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  PostEmailRecipient,
  PostEmailReport as Report,
  PostEmailSummary,
} from "@/lib/newsletter-queue";

type Filter = "all" | "opened" | "clicked" | "unopened" | "waiting";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "opened", label: "Opened" },
  { value: "clicked", label: "Clicked" },
  { value: "unopened", label: "Not opened" },
  { value: "waiting", label: "Waiting" },
];

const percent = (part: number, whole: number) =>
  whole ? `${Math.round((part / whole) * 100)}%` : "0%";

const when = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("en", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

// One-line summary shown on each post card in the blog admin.
export function EmailSummaryLine({
  summary,
  scheduled,
}: {
  summary?: PostEmailSummary;
  scheduled: boolean;
}) {
  if (!summary?.recipients) return null;
  return (
    <p className="mt-2 text-[11px] font-medium leading-5 text-muted">
      {summary.sent
        ? `✉ ${summary.sent}/${summary.recipients} emailed · ${percent(summary.opened, summary.sent)} opened · ${percent(summary.clicked, summary.sent)} clicked`
        : scheduled
          ? `✉ Emails ${summary.recipients} subscribers after it goes live`
          : `✉ ${summary.waiting} emails waiting to send`}
    </p>
  );
}

function linkLabel(url: string) {
  if (/\/unsubscribe\b/.test(url)) return "Unsubscribe link";
  if (/#quiz-/.test(url)) return "Quiz: answer on the website";
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

function recipientDetail(recipient: PostEmailRecipient) {
  if (recipient.status === "waiting") return { text: "Waiting to send", tone: "text-amber" };
  if (recipient.status === "skipped") return { text: "Skipped", tone: "text-muted" };
  if (recipient.clickedAt)
    return {
      text: `Clicked ${recipient.clicks === 1 ? "once" : `${recipient.clicks} times`} · ${when(recipient.clickedAt)}`,
      tone: "text-emerald-700",
    };
  if (recipient.openedAt)
    return { text: `Opened ${when(recipient.openedAt)}`, tone: "text-primary" };
  if (!recipient.tracked) return { text: `Sent ${when(recipient.sentAt)} · not tracked`, tone: "text-muted" };
  return { text: `Sent ${when(recipient.sentAt)} · not opened yet`, tone: "text-muted" };
}

function Tile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-ink-border bg-surface-2 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-parchment">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{note}</p>
    </div>
  );
}

export default function PostEmailReport({
  postId,
  password,
  onClose,
}: {
  postId: string;
  password: string;
  onClose: () => void;
}) {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/newsletter/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "email-report", password, postId }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Could not load the email report.");
        return data as Report;
      })
      .then((data) => {
        if (!cancelled) setReport(data);
      })
      .catch((reason) => {
        if (cancelled) return;
        const message = reason instanceof Error ? reason.message : "Could not load the email report.";
        setError(
          /newsletter_(events|campaigns|deliveries)|resend_id|post_id|does not exist/i.test(message)
            ? "Email tracking is not set up yet. Run supabase/newsletter-tracking.sql in Supabase."
            : message,
        );
      });
    return () => {
      cancelled = true;
    };
  }, [postId, password]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const visible = useMemo(() => {
    if (!report) return [];
    const search = query.trim().toLowerCase();
    return report.recipients.filter((recipient) => {
      if (search && !recipient.email.toLowerCase().includes(search)) return false;
      if (filter === "opened") return Boolean(recipient.openedAt);
      if (filter === "clicked") return Boolean(recipient.clickedAt);
      if (filter === "unopened") return recipient.status === "sent" && !recipient.openedAt;
      if (filter === "waiting") return recipient.status === "waiting";
      return true;
    });
  }, [report, query, filter]);

  const summary = report?.summary;
  const emailed = Boolean(summary && (summary.recipients || summary.skipped));
  const firstSent = report?.recipients
    .map((recipient) => recipient.sentAt)
    .filter((value): value is string => Boolean(value))
    .sort()[0];

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-report-title"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-ink-border pb-5">
          <div className="min-w-0">
            <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">
              Email report
            </p>
            <h2
              id="email-report-title"
              className="mt-2 font-display text-xl font-semibold leading-snug md:text-2xl"
            >
              {report?.title || "Loading..."}
            </h2>
            {report && (
              <p className="mt-1 text-xs text-muted">
                {report.postStatus === "draft"
                  ? "Draft"
                  : `${report.postStatus === "scheduled" ? "Scheduled for" : "Published"} ${when(report.publishedAt)}`}
                {firstSent ? ` · First emailed ${when(firstSent)}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-ink-border px-4 py-2 text-sm font-semibold"
          >
            Close
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        {!report && !error && (
          <p className="py-16 text-center text-sm text-muted">Loading the email report...</p>
        )}
        {report && !emailed && (
          <p className="py-12 text-center text-sm leading-6 text-muted">
            This post has not been emailed to subscribers.
          </p>
        )}

        {report && summary && emailed && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Tile label="Emailed" value={String(summary.sent)} note={`of ${summary.recipients} subscribers`} />
              <Tile
                label="Waiting"
                value={String(summary.waiting)}
                note={
                  !summary.waiting
                    ? "none left"
                    : report.postStatus === "published"
                      ? "sends as the daily limit allows"
                      : "sends after it goes live"
                }
              />
              <Tile label="Opened" value={percent(summary.opened, summary.sent)} note={`${summary.opened} people`} />
              <Tile label="Clicked" value={percent(summary.clicked, summary.sent)} note={`${summary.clicked} people`} />
            </div>

            <div className="mt-5">
              <div className="flex h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="bg-primary transition-all"
                  style={{ width: percent(summary.sent, summary.recipients) }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                {summary.sent} of {summary.recipients} sent
                {summary.skipped
                  ? ` · ${summary.skipped} skipped because they unsubscribed before their turn`
                  : ""}
              </p>
            </div>

            {report.links.length > 0 && (
              <section className="mt-7">
                <h3 className="text-sm font-semibold">Links people clicked</h3>
                <ul className="mt-3 divide-y divide-ink-border rounded-2xl border border-ink-border">
                  {report.links.slice(0, 8).map((link) => (
                    <li key={link.url} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      <span className="min-w-0 truncate text-muted" title={link.url}>
                        {linkLabel(link.url)}
                      </span>
                      <span className="shrink-0 font-semibold">
                        {link.people} {link.people === 1 ? "person" : "people"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold">Subscribers</h3>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search email"
                  aria-label="Search subscribers"
                  className="w-full rounded-xl border border-ink-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary sm:w-56"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filters.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={filter === option.value}
                    onClick={() => setFilter(option.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${filter === option.value ? "border-primary bg-primary text-white" : "border-ink-border text-muted hover:border-primary"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 max-h-[26rem] overflow-y-auto rounded-2xl border border-ink-border">
                {visible.length ? (
                  <ul className="divide-y divide-ink-border">
                    {visible.map((recipient, index) => {
                      const detail = recipientDetail(recipient);
                      return (
                        <li
                          key={`${recipient.email}-${index}`}
                          className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        >
                          <span className="min-w-0 truncate font-medium">{recipient.email}</span>
                          <span className={`shrink-0 text-xs font-medium ${detail.tone}`}>
                            {detail.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="p-8 text-center text-sm text-muted">No subscribers match.</p>
                )}
              </div>
            </section>

            <p className="mt-5 text-xs leading-5 text-muted">
              Opens are an estimate: some email apps, like Apple Mail, open emails
              automatically, and others block the tracking image. Clicks are the
              more reliable signal.
              {report.untracked
                ? ` ${report.untracked} emails were sent before tracking was turned on, so their opens and clicks are not recorded.`
                : ""}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
