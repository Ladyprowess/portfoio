# Lady Prowess portfolio assistant email endpoint

This adds a server-side API to the existing Next.js portfolio. It uses the current Resend sender, signature, Supabase `sent_emails` table, and email tracking events.

## Files

- `app/api/assistant-email/route.ts` — authenticated API endpoint.
- `supabase/assistant-email.sql` — one-time database migration.

## 1. Add the files

Copy `app/api/assistant-email/route.ts` into the portfolio repository at:

`app/api/assistant-email/route.ts`

Run `supabase/assistant-email.sql` in the Supabase SQL Editor.

## 2. Add Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

- `PORTFOLIO_ASSISTANT_API_KEY` — generate a random secret of at least 32 characters. Example command: `openssl rand -hex 32`. Do not use the example output as a production key.
- `PORTFOLIO_ASSISTANT_DAILY_LIMIT` — optional; defaults to `20`.

Your existing `RESEND_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` must already be configured, as used by the current email system.

Redeploy after adding the variables.

## 3. API authentication

Every request must include:

`Authorization: Bearer YOUR_PORTFOLIO_ASSISTANT_API_KEY`

Do not put this key in browser JavaScript, a public website page, a Git repository, or a ChatGPT prompt. It belongs only in a trusted server-side connector's encrypted secret store.

Endpoint:

`POST https://YOUR-DOMAIN/api/assistant-email`

All actions use JSON POST requests.

## 4. Actions

### Send a new email

```json
{
  "action": "send",
  "requestId": "unique-id-for-this-send-0001",
  "to": "person@example.com",
  "subject": "Following up",
  "body": "Hi there,\n\nThank you for your time. I wanted to follow up on our conversation.\n\nBest,\nNgozi"
}
```

### List recently sent email

```json
{
  "action": "list_recent",
  "limit": 10
}
```

### Read one email, including its original body and tracking events

```json
{
  "action": "get_email",
  "emailId": "UUID_FROM_LIST_RECENT"
}
```

### Reuse a sent email and send it to a different address

```json
{
  "action": "resend",
  "requestId": "unique-id-for-this-resend-0001",
  "emailId": "UUID_FROM_LIST_RECENT",
  "to": "another-person@example.com"
}
```

`resend` reuses the original subject and body, but sends to the new recipient. The branded signature is appended by the platform.

## 5. Safety and current limitation

- Only one primary recipient can be specified per send.
- The server validates recipient, subject, and body.
- A daily cap applies to emails sent through this endpoint.
- `requestId` is protected by a unique database index; reuse the same ID for a retry of the same intended send.
- An ambiguous provider/network result is not automatically retried. Check the email history first to avoid duplicate delivery.
- This endpoint is the website-side foundation. It does not itself connect a Go ChatGPT account to custom write-enabled tools. A trusted connector that can make authenticated HTTP calls is still required, and the API key must be stored in that connector's secret store.
