create extension if not exists pgcrypto;

create table if not exists public.sent_emails (
  id uuid primary key default gen_random_uuid(),
  resend_id text,
  recipients text[] not null default '{}',
  cc text[] not null default '{}',
  bcc text[] not null default '{}',
  subject text not null,
  preview text,
  body_html text not null,
  status text not null default 'preparing',
  sent_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id bigint generated always as identity primary key,
  email_id uuid not null references public.sent_emails(id) on delete cascade,
  event_type text not null check (event_type in ('open', 'click')),
  url text,
  user_agent text,
  source text not null default 'custom',
  provider_event_id text unique,
  occurred_at timestamptz not null default now()
);

create index if not exists email_events_email_id_idx on public.email_events(email_id);
alter table public.email_events add column if not exists source text not null default 'custom';
alter table public.email_events add column if not exists provider_event_id text;
create unique index if not exists email_events_provider_event_id_idx on public.email_events(provider_event_id) where provider_event_id is not null;
alter table public.sent_emails enable row level security;
alter table public.email_events enable row level security;
