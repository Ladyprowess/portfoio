create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  category text not null default 'Insights',
  newsletter_topic text not null default 'Web3',
  cover_image text,
  content_html text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts
add column if not exists newsletter_topic text not null default 'Web3';

create index if not exists blog_posts_public_index on public.blog_posts (status, published_at desc);

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

create index if not exists newsletter_subscribers_status_index on public.newsletter_subscribers (status, created_at desc);
alter table public.newsletter_subscribers enable row level security;

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts for select
using (status = 'published');

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;
