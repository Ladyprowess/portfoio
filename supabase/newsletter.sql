create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  topics text[] not null default '{All}',
  tier text not null default 'free' check (tier in ('free', 'paid')),
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  source text not null default 'website',
  unsubscribe_token text unique not null default gen_random_uuid()::text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_status_index
on public.newsletter_subscribers (status, created_at desc);

alter table public.newsletter_subscribers enable row level security;
