"use client";

import { useCallback, useEffect, useState } from "react";

type QueueStatus = {
  waiting: number;
  usedToday: number;
  dailyAllowance: number;
  campaigns: { id: string; title: string; createdAt: string; waiting: number }[];
};

export default function NewsletterQueuePanel({ password }: { password: string }) {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const call = useCallback(
    async (action: "queue-status" | "process-queue") => {
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const error = String(data.error || "Could not load the email queue.");
        throw new Error(
          /newsletter_(deliveries|campaigns)|does not exist/i.test(error)
            ? "The email queue is not set up yet. Run supabase/newsletter-queue.sql in Supabase."
            : error,
        );
      }
      return data;
    },
    [password],
  );

  const refresh = useCallback(async () => {
    try {
      setStatus(await call("queue-status"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load the email queue.");
    }
  }, [call]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function sendNow() {
    setBusy(true);
    setMessage("");
    try {
      const result = await call("process-queue");
      let next = result.sent
        ? `${result.sent} emails sent. ${result.waiting} still waiting.`
        : result.waiting
          ? "Today's email limit is used up. The rest will go out automatically once it resets."
          : "Nothing is waiting to be sent.";
      if (result.problem) next += ` ${result.problem}`;
      setMessage(next);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send the next batch.");
    } finally {
      setBusy(false);
    }
  }

  if (!status)
    return message ? (
      <p className="mt-6 rounded-xl bg-white px-4 py-3 text-sm text-muted">{message}</p>
    ) : null;

  const left = Math.max(0, status.dailyAllowance - status.usedToday);
  return (
    <div className="mt-7 rounded-2xl border border-ink-border bg-white p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Email queue</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            {status.waiting
              ? `${status.waiting} emails are waiting. They go out automatically as the daily limit allows.`
              : "Everyone is up to date. No emails are waiting."}
          </p>
          <p className="mt-1 text-xs text-muted">
            {status.usedToday} emails sent in the last 24 hours · {left} of{" "}
            {status.dailyAllowance} newsletter emails left
          </p>
        </div>
        {status.waiting > 0 && (
          <button
            disabled={busy || left === 0}
            onClick={sendNow}
            title={left === 0 ? "The daily limit is used up" : undefined}
            className="shrink-0 rounded-full border border-primary/30 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-primary disabled:opacity-50"
          >
            {busy ? "Sending..." : "Send next batch now"}
          </button>
        )}
      </div>
      {status.campaigns.length > 0 && (
        <ul className="mt-4 divide-y divide-ink-border border-t border-ink-border text-sm">
          {status.campaigns.map((campaign) => (
            <li key={campaign.id} className="flex items-center justify-between gap-4 py-3">
              <span className="min-w-0 truncate font-medium">{campaign.title}</span>
              <span className="shrink-0 text-muted">{campaign.waiting} waiting</span>
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
