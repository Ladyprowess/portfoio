import { NextResponse } from "next/server";
import { db } from "@/lib/email-store";

// Used by the unsubscribe page (token in a JSON body) and by the one-click
// unsubscribe button in Gmail, Yahoo and Apple Mail, which posts
// "List-Unsubscribe=One-Click" to the List-Unsubscribe URL (token in the URL).
export async function POST(request: Request) {
  try {
    const body = await request.text();
    let token = new URL(request.url).searchParams.get("token") || "";
    if (!token) {
      try {
        token = String(JSON.parse(body).token || "");
      } catch {
        // A one-click request is form-encoded, not JSON.
      }
    }
    token = token.trim();
    if (!token)
      return NextResponse.json(
        { error: "This unsubscribe link is incomplete." },
        { status: 400 },
      );

    const [subscriber] = await db(
      `newsletter_subscribers?select=id,status&unsubscribe_token=eq.${encodeURIComponent(token)}&limit=1`,
    );
    if (!subscriber)
      return NextResponse.json(
        { error: "This unsubscribe link is not valid. Please use the link from your most recent email." },
        { status: 404 },
      );
    if (subscriber.status === "unsubscribed")
      return NextResponse.json({ ok: true, alreadyUnsubscribed: true });

    await db(
      `newsletter_subscribers?id=eq.${encodeURIComponent(String(subscriber.id))}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "unsubscribed",
          updated_at: new Date().toISOString(),
        }),
      },
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not unsubscribe this email.",
      },
      { status: 500 },
    );
  }
}
