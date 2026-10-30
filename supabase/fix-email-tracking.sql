-- Run once in the portfolio project's Supabase SQL Editor.
-- Repairs webhook error 42P10 without changing existing emails or events.
-- Keep the old partial index until the replacement has been created successfully.
begin;
create unique index if not exists email_events_provider_event_id_unique_idx
  on public.email_events (provider_event_id);
drop index if exists public.email_events_provider_event_id_idx;
commit;

-- Then replay failed email.opened/email.clicked events in Resend > Webhooks.
