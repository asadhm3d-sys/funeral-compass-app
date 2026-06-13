-- =====================================================================
-- Funeral Compass — Supabase schema
-- Run this in the Supabase SQL editor of your own project, then set
--   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
-- and the app switches from local demo storage to Supabase automatically.
-- =====================================================================

create extension if not exists "pgcrypto";

create table if not exists public.plans (
  id          uuid primary key default gen_random_uuid(),
  owner       text not null,                -- auth email (or guest id)
  name        text not null,
  status      text not null default 'draft'
              check (status in ('draft', 'submitted', 'deposit_confirmed')),
  state       jsonb not null,               -- full WizardState
  submission  jsonb,                        -- SubmissionInfo
  payment     jsonb,                        -- MockPaymentInfo (demo only)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists plans_owner_idx on public.plans (owner, updated_at desc);

-- ---------------------------------------------------------------------
-- Row Level Security: users only ever see their own plans.
-- Owner is matched against the authenticated email (magic-link login).
-- ---------------------------------------------------------------------
alter table public.plans enable row level security;

drop policy if exists "plans_select_own" on public.plans;
create policy "plans_select_own" on public.plans
  for select using (owner = auth.jwt() ->> 'email');

drop policy if exists "plans_insert_own" on public.plans;
create policy "plans_insert_own" on public.plans
  for insert with check (owner = auth.jwt() ->> 'email');

drop policy if exists "plans_update_own" on public.plans;
create policy "plans_update_own" on public.plans
  for update using (owner = auth.jwt() ->> 'email');

drop policy if exists "plans_delete_own" on public.plans;
create policy "plans_delete_own" on public.plans
  for delete using (owner = auth.jwt() ->> 'email');

-- GDPR note: plans contain personal data (names, family circumstances).
-- Choose an EU region (e.g. Frankfurt) when creating the Supabase project,
-- and keep retention minimal.
