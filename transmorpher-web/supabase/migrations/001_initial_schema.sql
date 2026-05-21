-- =============================================================================
-- Transmorpher Hub — Initial Database Schema
-- Phase 1: Foundation & Database
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- Extends Supabase Auth. One row per authenticated user.
-- A trigger automatically creates a profile when a user signs up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Public user profiles linked to Supabase Auth.';

-- RLS
alter table public.profiles enable row level security;

-- Anyone can read profiles.
create policy "Profiles: public read"
  on public.profiles for select
  using (true);

-- Users can only update their own profile.
create policy "Profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Inserts are handled by the trigger below; allow the service role and the
-- trigger function to insert. We also allow users to insert their own row
-- in case the trigger is bypassed (e.g., manual sign-up flows).
create policy "Profiles: self insert"
  on public.profiles for insert
  with check (auth.uid() = id);


-- ---------------------------------------------------------------------------
-- 2. LOADOUTS
-- Stores parsed addon loadout data.
-- ---------------------------------------------------------------------------
create table public.loadouts (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid not null references public.profiles(id) on delete cascade,
  title          text not null,
  description    text,
  class_id       smallint,                  -- WoW class ID (1-11 for WotLK)
  race_id        smallint,                  -- WoW race ID
  import_string  text not null,             -- Original addon export string
  parsed_data    jsonb not null default '{}', -- Full parsed gear/morph/enchant state
  screenshot_url text,                      -- Optional screenshot uploaded by user
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.loadouts is 'Community-submitted Transmorpher addon loadouts.';

-- Indexes for common query patterns
create index idx_loadouts_author   on public.loadouts(author_id);
create index idx_loadouts_class    on public.loadouts(class_id);
create index idx_loadouts_created  on public.loadouts(created_at desc);

-- RLS
alter table public.loadouts enable row level security;

-- Anyone can read loadouts (public gallery).
create policy "Loadouts: public read"
  on public.loadouts for select
  using (true);

-- Only the author can insert their own loadouts.
create policy "Loadouts: author insert"
  on public.loadouts for insert
  with check (auth.uid() = author_id);

-- Only the author can update their own loadouts.
create policy "Loadouts: author update"
  on public.loadouts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Only the author can delete their own loadouts.
create policy "Loadouts: author delete"
  on public.loadouts for delete
  using (auth.uid() = author_id);


-- ---------------------------------------------------------------------------
-- 3. UPVOTES
-- Join table tracking which user upvoted which loadout.
-- Composite PK prevents double-upvoting.
-- ---------------------------------------------------------------------------
create table public.upvotes (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  loadout_id  uuid not null references public.loadouts(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, loadout_id)
);

comment on table public.upvotes is 'Tracks community upvotes on loadouts.';

-- Index for fast "how many upvotes does this loadout have?" queries
create index idx_upvotes_loadout on public.upvotes(loadout_id);

-- RLS
alter table public.upvotes enable row level security;

-- Anyone can read upvote counts.
create policy "Upvotes: public read"
  on public.upvotes for select
  using (true);

-- Users can insert their own upvote.
create policy "Upvotes: self insert"
  on public.upvotes for insert
  with check (auth.uid() = user_id);

-- Users can remove their own upvote.
create policy "Upvotes: self delete"
  on public.upvotes for delete
  using (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- 4. HELPER: Upvote count view
-- Provides a quick way to get loadout IDs with their upvote totals.
-- ---------------------------------------------------------------------------
create or replace view public.loadout_upvote_counts as
select
  loadout_id,
  count(*) as upvote_count
from public.upvotes
group by loadout_id;


-- ---------------------------------------------------------------------------
-- 5. AUTO-CREATE PROFILE ON SIGN-UP (Trigger)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name',   -- GitHub / Discord username
             new.raw_user_meta_data ->> 'name',
             'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- 6. AUTO-UPDATE `updated_at` COLUMN (Trigger)
-- ---------------------------------------------------------------------------
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at();

create trigger set_loadouts_updated_at
  before update on public.loadouts
  for each row
  execute function public.update_updated_at();
