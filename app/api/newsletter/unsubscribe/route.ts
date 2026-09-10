import { NextResponse } from "next/server";
import { db } from "@/lib/email-store";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const token = String(payload.token || "").trim();
    if (!token)
      return NextResponse.json(
        { error: "The unsubscribe link is incomplete." },
        { status: 400 },
      );
    await db(
      `newsletter_subscribers?unsubscribe_token=eq.${encodeURIComponent(token)}`,
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
