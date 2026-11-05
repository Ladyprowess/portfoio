# Backend fix for the existing AI Email Assistant

This is intentionally limited to the two server-side items missing from the current build:

1. `app/api/assistant-draft/route.ts` — generates drafts with the OpenAI Responses API.
2. `email-assistant-auth.patch` — updates the existing `app/api/assistant-email/route.ts` so the private admin page can authenticate with the existing `COMPOSE_PASSWORD` via `x-admin-password`, while retaining Bearer API-key authentication for server-to-server use.

Do not re-copy or replace the existing page, `AssistantWorkspace.tsx`, or navigation component.

## Install

From the repository root:

```bash
unzip -o ~/Downloads/portfolio-ai-email-backend-fix.zip -d .
git apply --check email-assistant-auth.patch
git apply email-assistant-auth.patch
npm run build
```

The build output should include:

```text
ƒ /api/assistant-draft
ƒ /api/assistant-email
○ /admin/assistant
```

If `git apply --check` reports that the patch does not apply, stop and do not force it. The auth function may have already been changed; inspect `app/api/assistant-email/route.ts` instead.

## Vercel environment variable

Set `OPENAI_API_KEY` in the Vercel project for Production (and Preview if needed), then redeploy. The draft route uses `OPENAI_EMAIL_MODEL` when set; otherwise it defaults to `gpt-6-luna`. Keep the API key server-side; never prefix it with `NEXT_PUBLIC_`.

API usage is billed separately from ChatGPT subscriptions.
