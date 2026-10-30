-- Cold-email outreach tracker. Run once in the Supabase SQL editor.
-- Leads come from Apollo CSV exports; emails go out through the existing
-- sent_emails table (so the Resend webhook already sees them), and each lead's
-- status is updated automatically from sends, opens, clicks, bounces and replies.

create extension if not exists pgcrypto;

create table if not exists public.outreach_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,
  title text,
  company text,
  website text,
  linkedin text,
  country text,
  industry text,
  source text not null default 'apollo',
  source_id text,
  -- new → sent → opened → clicked → replied; bounced / stopped end the sequence.
  status text not null default 'new' check (status in ('new', 'sent', 'opened', 'clicked', 'replied', 'bounced', 'stopped')),
  notes text not null default '',
  follow_ups integer not null default 0,
  last_email_id uuid references public.sent_emails(id) on delete set null,
  first_sent_at timestamptz,
  last_sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  bounced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per address, whatever the capitalisation: re-importing never duplicates.
create unique index if not exists outreach_leads_email_idx on public.outreach_leads (lower(email));
create index if not exists outreach_leads_status_idx on public.outreach_leads (status);

-- Replies received by the inbound webhook, kept so you can read them on the lead.
create table if not exists public.outreach_replies (
  id bigint generated always as identity primary key,
  lead_id uuid references public.outreach_leads(id) on delete cascade,
  from_email text not null,
  subject text,
  snippet text,
  provider_event_id text unique,
  received_at timestamptz not null default now()
);

-- A single settings row, edited from the admin outreach page.
create table if not exists public.outreach_settings (
  id integer primary key default 1 check (id = 1),
  daily_limit integer not null default 20 check (daily_limit between 1 and 100),
  follow_up_days integer not null default 3 check (follow_up_days between 1 and 30),
  max_follow_ups integer not null default 2 check (max_follow_ups between 0 and 5),
  subject text not null default '',
  body text not null default '',
  follow_up_body text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.outreach_settings (id) values (1) on conflict (id) do nothing;

-- Link a sent email back to its lead, so webhook events can update the lead.
alter table public.sent_emails add column if not exists lead_id uuid references public.outreach_leads(id) on delete set null;
alter table public.sent_emails add column if not exists kind text not null default 'compose';
create index if not exists sent_emails_lead_id_idx on public.sent_emails (lead_id);

-- Bounces are recorded alongside opens and clicks.
alter table public.email_events drop constraint if exists email_events_event_type_check;
alter table public.email_events add constraint email_events_event_type_check check (event_type in ('open', 'click', 'bounce'));

alter table public.outreach_leads enable row level security;
alter table public.outreach_replies enable row level security;
alter table public.outreach_settings enable row level security;

-- ── Templates library ──────────────────────────────────────────
-- Any number of named emails (pitches, job applications, LinkedIn follow-ups…).
-- Each is personalised per contact and can be edited before it is sent.
create table if not exists public.outreach_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null default '',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.outreach_templates enable row level security;

-- Contacts can come from anywhere, not only Apollo: 'apollo', 'linkedin',
-- 'referral', 'event', 'website', 'other'. (Free text; the dashboard offers these.)
alter table public.outreach_leads alter column source set default 'other';

-- Scheduled emails sit in sent_emails with status 'scheduled' and sent_at set to
-- the time Resend will deliver them; cancelled ones keep status 'cancelled'.
create index if not exists sent_emails_status_sent_at_idx on public.sent_emails (status, sent_at);

-- A contact can have more than one address. The main one stays in `email`;
-- the rest live here (lowercase) and every email to the contact goes to all of them.
alter table public.outreach_leads add column if not exists other_emails text[] not null default '{}';
create index if not exists outreach_leads_other_emails_idx on public.outreach_leads using gin (other_emails);
