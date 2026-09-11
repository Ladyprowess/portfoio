import { NextResponse } from "next/server";
import { processNewsletterQueue } from "@/lib/newsletter-queue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called by Vercel Cron (see vercel.json). Vercel sends CRON_SECRET as a bearer token.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret)
    return NextResponse.json({ error: "CRON_SECRET is not set." }, { status: 500 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  try {
    return NextResponse.json({ ok: true, ...(await processNewsletterQueue()) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not send the queue." },
      { status: 500 },
    );
  }
}
