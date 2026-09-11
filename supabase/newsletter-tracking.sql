-- Open and click tracking for newsletter emails, and linking newsletters to blog
-- posts so scheduled posts are emailed when they go live. Run after
-- newsletter-queue.sql.

alter table public.newsletter_campaigns add column if not exists post_id text;
create index if not exists newsletter_campaigns_post_id_idx
on public.newsletter_campaigns (post_id);

alter table public.newsletter_deliveries add column if not exists resend_id text;
create index if not exists newsletter_deliveries_resend_id_idx
on public.newsletter_deliveries (resend_id);

create table if not exists public.newsletter_events (
  id bigint generated always as identity primary key,
  delivery_id uuid not null references public.newsletter_deliveries(id) on delete cascade,
  campaign_id uuid not null references public.newsletter_campaigns(id) on delete cascade,
  event_type text not null check (event_type in ('open', 'click')),
  url text,
  provider_event_id text unique,
  occurred_at timestamptz not null default now()
);

create index if not exists newsletter_events_campaign_idx
on public.newsletter_events (campaign_id, event_type);

alter table public.newsletter_events enable row level security;
