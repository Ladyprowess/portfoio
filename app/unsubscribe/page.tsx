"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UnsubscribePage() {
  const [message, setMessage] = useState("Updating your subscription...");

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("preview") === "1") {
      setMessage("This is the unsubscribe link preview. Live emails contain a personal unsubscribe link.");
      return;
    }
    const token = parameters.get("token") || "";
    if (!token) {
      setMessage("This unsubscribe link is incomplete.");
      return;
    }
    fetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setMessage("You have been unsubscribed.");
      })
      .catch((error) =>
        setMessage(
          error instanceof Error
            ? error.message
            : "Could not update your subscription.",
        ),
      );
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-5">
      <div className="w-full max-w-lg rounded-3xl border border-ink-border bg-white p-8 text-center">
        <p className="font-head text-xs font-bold uppercase tracking-wider text-primary">
          Email preferences
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold">{message}</h1>
        <Link
          href="/blog"
          className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
        >
          Return to the blog
        </Link>
      </div>
    </main>
  );
}
