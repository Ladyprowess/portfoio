-- Run once in the Supabase SQL Editor for the Lady Prowess portfolio.
-- Adds a unique idempotency key so repeated API calls cannot send the same
-- assistant request twice.

alter table public.sent_emails
  add column if not exists assistant_request_id text;

alter table public.sent_emails
  add column if not exists kind text not null default 'compose';

create unique index if not exists sent_emails_assistant_request_id_unique
  on public.sent_emails (assistant_request_id)
  where assistant_request_id is not null;
