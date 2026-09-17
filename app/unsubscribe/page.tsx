"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Stage = "loading" | "manage" | "done" | "error";

export default function EmailPreferencesPage() {
  const [stage, setStage] = useState<Stage>("loading");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState<"save" | "leave" | null>(null);
  const [message, setMessage] = useState("");

  const post = useCallback(async (body: Record<string, unknown>) => {
    const response = await fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Could not update your subscription.");
    return data;
  }, []);

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("preview") === "1") {
      setMessage("This is the preferences link preview. Live emails contain a personal link.");
      setStage("done");
      return;
    }
    const value = (parameters.get("token") || "").trim();
    if (!value) {
      setMessage("This link is incomplete.");
      setStage("error");
      return;
    }
    setToken(value);

    // Loading only reads. Nothing is changed until a button is pressed, because
    // email security scanners open every link in a message.
    post({ token: value, action: "load" })
      .then((data) => {
        if (data.status === "unsubscribed") {
          setMessage("You are unsubscribed from these emails.");
          setStage("done");
          return;
        }
        setEmail(data.email || "");
        const known: string[] = Array.isArray(data.choices) ? data.choices : [];
        const current: string[] = Array.isArray(data.topics) ? data.topics : [];
        setChoices(known);
        // "All" is a wildcard in storage; show it as every box ticked.
        setSelected(current.includes("All") ? known : current);
        setStage("manage");
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "Could not load your preferences.");
        setStage("error");
      });
  }, [post]);

  function toggle(topic: string) {
    setSelected((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic],
    );
  }

  async function save() {
    setBusy("save");
    try {
      const data = await post({ token, action: "save", topics: selected });
      setMessage(
        data.status === "unsubscribed"
          ? "You have been unsubscribed from every topic."
          : `Saved. You will receive ${selected.length === choices.length ? "every topic" : selected.join(", ")}.`,
      );
      setStage("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your preferences.");
      setStage("error");
    } finally {
      setBusy(null);
    }
  }

  async function leave() {
    setBusy("leave");
    try {
      const data = await post({ token, action: "unsubscribe" });
      setMessage(data.alreadyUnsubscribed ? "You were already unsubscribed." : "You have been unsubscribed.");
      setStage("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not unsubscribe this email.");
      setStage("error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-ink-border bg-surface p-8">
        <p className="font-head text-xs font-bold uppercase tracking-wider text-primary">
          Email preferences
        </p>

        {stage === "manage" ? (
          <>
            <h1 className="mt-4 font-display text-2xl font-bold">Choose what you receive.</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              {email ? <>Preferences for <span className="text-parchment">{email}</span>. </> : null}
              Untick a topic to stop those emails and keep the rest.
            </p>

            <fieldset className="mt-6">
              <legend className="sr-only">Newsletter topics</legend>
              <div className="flex flex-col gap-1">
                {choices.map((topic) => (
                  <label
                    key={topic}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 transition-colors hover:bg-surface-2"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(topic)}
                      onChange={() => toggle(topic)}
                      className="h-4 w-4 flex-none accent-primary"
                    />
                    <span className="text-sm font-semibold text-parchment">{topic}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-4 text-xs leading-5 text-muted" role="status">
              {selected.length
                ? `${selected.length} of ${choices.length} topics selected.`
                : "Nothing selected — saving now will unsubscribe you completely."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={save}
                disabled={busy !== null}
                className="min-h-12 flex-1 rounded-full bg-primary px-6 text-sm font-bold text-on-primary disabled:opacity-60"
              >
                {busy === "save" ? "Saving..." : "Save preferences"}
              </button>
              <button
                type="button"
                onClick={leave}
                disabled={busy !== null}
                className="min-h-12 rounded-full border border-ink-border px-6 text-sm font-bold text-muted transition-colors hover:text-parchment disabled:opacity-60"
              >
                {busy === "leave" ? "Unsubscribing..." : "Unsubscribe from all"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
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
          </div>
        )}
      </div>
    </main>
  );
}
