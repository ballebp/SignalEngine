-- Signal Engine: initial schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Bot configs (replaces localStorage)
create table if not exists bots (
  id     text primary key,
  config jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Signal log (every fired TradeRelay signal)
create table if not exists signal_log (
  id         uuid default gen_random_uuid() primary key,
  bot_id     text,
  bot_name   text,
  symbol     text,
  event      text,
  message    text,
  status     text default 'sent',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table bots       enable row level security;
alter table signal_log enable row level security;

-- Allow anon key full access (single-user personal app)
create policy "anon_bots_all"       on bots       for all to anon using (true) with check (true);
create policy "anon_signal_log_all" on signal_log for all to anon using (true) with check (true);

-- Index for fast signal log queries
create index if not exists signal_log_created_at_idx on signal_log (created_at desc);
create index if not exists signal_log_bot_id_idx     on signal_log (bot_id);
