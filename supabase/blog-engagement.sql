-- Apply once in the Supabase SQL editor before enabling engagement.
create table if not exists public.blog_comments (
 id uuid primary key default gen_random_uuid(),
 post_slug text not null,
 name text not null check (char_length(name) between 1 and 80),
 body text not null check (char_length(body) between 3 and 3000),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
create index if not exists blog_comments_post_status on public.blog_comments(post_slug,status,created_at desc);
create table if not exists public.blog_likes (
 post_slug text not null,
 visitor_id uuid not null,
 primary key(post_slug,visitor_id)
);
create table if not exists public.blog_rate_limits (
 key text primary key,
 window_start timestamptz not null default now(),
 attempts integer not null default 1
);
alter table public.blog_comments enable row level security;
alter table public.blog_likes enable row level security;
alter table public.blog_rate_limits enable row level security;
-- Only server-side service-role requests may read or mutate these tables.
revoke all on public.blog_comments, public.blog_likes, public.blog_rate_limits from anon, authenticated;
grant all on public.blog_comments, public.blog_likes, public.blog_rate_limits to service_role;
create or replace function public.blog_rate_limit(p_key text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare n integer;
begin
 insert into blog_rate_limits as r (key) values (p_key)
 on conflict (key) do update set
 attempts = case when r.window_start < now() - make_interval(secs => p_seconds) then 1 else r.attempts + 1 end,
 window_start = case when r.window_start < now() - make_interval(secs => p_seconds) then now() else r.window_start end
 returning attempts into n;
 delete from blog_rate_limits where window_start < now() - interval '1 day';
 return n <= p_limit;
end $$;
revoke all on function public.blog_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.blog_rate_limit(text,integer,integer) to service_role;
