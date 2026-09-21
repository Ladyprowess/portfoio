-- Stored, manually reviewed translations; no translation service is used.
alter table public.blog_posts
 add column if not exists title_ig text not null default '',
 add column if not exists excerpt_ig text not null default '',
 add column if not exists body_ig text not null default '',
 add column if not exists igbo_approved boolean not null default false;
