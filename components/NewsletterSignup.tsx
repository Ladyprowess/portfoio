"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { newsletterTopics, publicationName } from "@/lib/newsletter";

export default function NewsletterSignup({
  compact = false,
  inline = false,
  availableTopics,
  defaultTopics,
}: {
  compact?: boolean;
  inline?: boolean;
  availableTopics?: string[];
  defaultTopics?: string[];
}) {
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<string[]>(() =>
    defaultTopics?.length ? defaultTopics : ["All"],
  );
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const topicChoices = Array.from(new Set([...(availableTopics || []), ...newsletterTopics]));
  const inlineTopic = topics[0] || "All";

  function toggle(topic: string) {
    if (topic === "All") return setTopics(["All"]);
    setTopics((current) => {
      const withoutAll = current.filter((item) => item !== "All");
      return withoutAll.includes(topic)
        ? withoutAll.filter((item) => item !== topic)
        : [...withoutAll, topic];
    });
  }

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topics }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (!response.ok) throw new Error(data.error || "Could not subscribe.");
      posthog.capture("newsletter_subscribed", { topic_count: topics.length });
      setMessage("You are subscribed. New posts will arrive in your email.");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not subscribe.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      className={`border border-ink-border ${inline ? "rounded-2xl bg-surface-2 p-5 md:p-6" : `bg-white ${compact ? "rounded-2xl p-6" : "rounded-[2rem] p-7 md:p-10"}`}`}
    >
      {inline ? (
        <>
          <h2 className="font-display text-xl font-extrabold text-parchment">
            Get new {publicationName(inlineTopic)} posts in your inbox.
          </h2>
          <form onSubmit={subscribe} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="min-h-12 w-full rounded-full border border-ink-border bg-white px-5 text-sm outline-none focus:border-primary"
              />
            </label>
            <button
              disabled={saving}
              className="min-h-12 rounded-full bg-primary px-7 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-muted" role="status">{message}</p>}
        </>
      ) : (
        <>
      <p className="font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">
        Choose what reaches your inbox
      </p>
      <h2
        className={`mt-3 font-display font-extrabold ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}
      >
        Get the latest posts delivered to your inbox.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Select the topics you want to receive.
      </p>
      <form onSubmit={subscribe} className="mt-6">
        <div className="flex flex-wrap gap-2">
          {["All", ...topicChoices].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggle(topic)}
              aria-pressed={topics.includes(topic)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold ${topics.includes(topic) ? "border-primary bg-primary text-white" : "border-ink-border bg-white text-muted"}`}
            >
              {topic}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="min-h-12 w-full rounded-full border border-ink-border bg-bg px-5 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            disabled={saving || !topics.length}
            className="min-h-12 rounded-full bg-primary px-7 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Subscribing..." : "Subscribe free"}
          </button>
        </div>
        {message && (
          <p className="mt-3 text-sm text-muted" role="status">
            {message}
          </p>
        )}
      </form>
        </>
      )}
    </section>
  );
}
