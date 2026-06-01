-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

create table public.aml_checks (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users on delete cascade not null,
  address     text        not null,
  chain       jsonb       not null,
  risk_level  text        not null,
  risk_score  integer     not null,
  risk_factors jsonb      not null default '[]',
  checked_at  timestamptz not null default now()
);

-- Row Level Security: users see only their own data
alter table public.aml_checks enable row level security;

create policy "select own checks"
  on public.aml_checks for select
  using (auth.uid() = user_id);

create policy "insert own checks"
  on public.aml_checks for insert
  with check (auth.uid() = user_id);

create policy "delete own checks"
  on public.aml_checks for delete
  using (auth.uid() = user_id);

-- Index for fast queries per user
create index aml_checks_user_id_idx on public.aml_checks(user_id);
create index aml_checks_checked_at_idx on public.aml_checks(checked_at desc);
