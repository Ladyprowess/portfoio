-- Newsletter sending queue. Resend's free plan allows 100 emails a day, so each
-- newsletter becomes a campaign with one delivery row per subscriber. Deliveries
-- that do not fit into today's allowance stay pending until the daily cron job.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content_html text not null,
  topic text not null,
  post_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_deliveries (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  email text not null,
  queue_position integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'skipped')),
  error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (campaign_id, subscriber_id)
);

create index if not exists newsletter_deliveries_queue_idx
on public.newsletter_deliveries (status, created_at, queue_position);

create index if not exists newsletter_deliveries_sent_at_idx
on public.newsletter_deliveries (sent_at)
where status = 'sent';

create index if not exists newsletter_deliveries_campaign_idx
on public.newsletter_deliveries (campaign_id);

alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_deliveries enable row level security;
