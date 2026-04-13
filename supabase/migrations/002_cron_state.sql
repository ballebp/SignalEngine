-- Stores the last-fired signal time per bot for the headless cron worker.
-- Also stores per-bot cron settings (enabled, tradeRelayUrl already in bot config).

create table if not exists cron_state (
  bot_id       text primary key,
  last_fired   bigint default 0,          -- unix seconds of last fired signal
  last_run     timestamptz default now(), -- last time cron processed this bot
  last_status  text default 'ok',         -- 'ok' | 'error' | 'blocked'
  last_message text default ''
);

alter table cron_state enable row level security;
create policy "anon_cron_state_all" on cron_state for all to anon using (true) with check (true);

-- Also store global cron settings (AI gate key etc.) in a kv table
create table if not exists cron_settings (
  key   text primary key,
  value text not null default ''
);

alter table cron_settings enable row level security;
create policy "anon_cron_settings_all" on cron_settings for all to anon using (true) with check (true);
