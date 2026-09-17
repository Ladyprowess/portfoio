"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stage = "loading" | "confirm" | "working" | "done" | "error";

export default function UnsubscribePage() {
  const [stage, setStage] = useState<Stage>("loading");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("preview") === "1") {
      setMessage("This is the unsubscribe link preview. Live emails contain a personal unsubscribe link.");
      setStage("done");
      return;
    }
    const value = parameters.get("token") || "";
    if (!value) {
      setMessage("This unsubscribe link is incomplete.");
      setStage("error");
      return;
    }
    setToken(value);
    setStage("confirm");
  }, []);

  // Unsubscribing waits for this button because some email security scanners open
  // every link in an email, which would otherwise unsubscribe people by accident.
  async function unsubscribe() {
    setStage("working");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not update your subscription.");
      setMessage(data.alreadyUnsubscribed ? "You were already unsubscribed." : "You have been unsubscribed.");
      setStage("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update your subscription.");
      setStage("error");
    }
  }

  const confirming = stage === "confirm" || stage === "working";

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5">
      <div className="w-full max-w-lg rounded-3xl border border-ink-border bg-surface p-8 text-center">
        <p className="font-head text-xs font-bold uppercase tracking-wider text-primary">
          Email preferences
        </p>
        {confirming ? (
          <>
            <h1 className="mt-4 font-display text-2xl font-bold">
              Unsubscribe from these emails?
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              You will stop receiving new posts by email. You can subscribe again at any time.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={unsubscribe}
                disabled={stage === "working"}
                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary disabled:opacity-60"
              >
                {stage === "working" ? "Unsubscribing..." : "Yes, unsubscribe me"}
              </button>
              <Link
                href="/blog"
                className="rounded-full border border-ink-border px-6 py-3 text-sm font-bold text-parchment"
              >
                Keep my subscription
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1
              className="mt-4 font-display text-2xl font-bold"
              role={stage === "error" ? "alert" : undefined}
            >
              {stage === "loading" ? "Loading..." : message}
            </h1>
            <Link
              href="/blog"
              className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-on-primary"
            >
              Return to the blog
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
