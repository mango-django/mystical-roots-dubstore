-- =====================================================================
-- Mystical Roots — base schema (reconstructed from application code)
-- The original schema was created by hand in the Supabase dashboard and
-- was never committed. This file rebuilds every table, RLS policy,
-- storage bucket and the profile-creation trigger that the app relies on.
-- Safe to re-run (idempotent).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  is_admin    boolean not null default false,
  is_vip      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- TRACKS
-- ---------------------------------------------------------------------
create table if not exists public.tracks (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  artist          text not null,
  price           integer not null default 0,          -- pence
  format          text not null default 'mp3',
  file_path       text,                                 -- private "tracks" bucket
  preview_path    text,                                 -- public  "previews" bucket
  cover_path      text,                                 -- public  "covers" bucket
  download_limit  integer default 3,
  is_hero         boolean not null default false,
  is_release      boolean not null default false,
  is_exclusive    boolean not null default false,
  top10_position  integer,
  created_at      timestamptz not null default now()
);
create index if not exists idx_tracks_is_exclusive on public.tracks (is_exclusive);
create index if not exists idx_tracks_is_release   on public.tracks (is_release);

-- ---------------------------------------------------------------------
-- MERCH
-- ---------------------------------------------------------------------
create table if not exists public.merch_products (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  image_path  text,                                     -- public "merch" bucket
  base_price  integer,
  created_at  timestamptz not null default now()
);

create table if not exists public.merch_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.merch_products(id) on delete cascade,
  colour      text,
  size        text,
  price       integer not null default 0,               -- pence
  created_at  timestamptz not null default now()
);
create index if not exists idx_merch_variants_product on public.merch_variants (product_id);

-- ---------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete set null,
  stripe_session_id   text,
  total               integer,                          -- pence
  created_at          timestamptz not null default now()
);
create index if not exists idx_orders_user on public.orders (user_id);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete cascade,
  track_id    uuid references public.tracks(id) on delete set null,
  product_id  uuid references public.merch_products(id) on delete set null,
  variant_id  uuid references public.merch_variants(id) on delete set null,
  quantity    integer default 1,
  price       integer,
  created_at  timestamptz not null default now()
);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_order_items_track on public.order_items (track_id);

create table if not exists public.merch_order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete cascade,
  variant_id  uuid references public.merch_variants(id) on delete set null,
  product_id  uuid references public.merch_products(id) on delete set null,
  title       text,
  colour      text,
  size        text,
  price       integer,
  created_at  timestamptz not null default now()
);
create index if not exists idx_merch_order_items_order on public.merch_order_items (order_id);

-- ---------------------------------------------------------------------
-- PURCHASED TRACKS (entitlements for downloads)
-- ---------------------------------------------------------------------
create table if not exists public.purchased_tracks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete cascade,
  track_id    uuid references public.tracks(id) on delete cascade,
  title       text,
  file_path   text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_purchased_tracks_user on public.purchased_tracks (user_id);

-- ---------------------------------------------------------------------
-- DUBSTORE curation
-- ---------------------------------------------------------------------
create table if not exists public.dubstore_section_tracks (
  track_id     uuid not null references public.tracks(id) on delete cascade,
  section_key  text not null,
  position     integer not null default 0,
  primary key (track_id, section_key)
);

create table if not exists public.dubstore_hero_slides (
  track_id   uuid primary key references public.tracks(id) on delete cascade,
  position   integer not null default 0
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- The browser uses the anon/authenticated key; the server uses the
-- service-role key (which bypasses RLS). Policies below only open up
-- what the browser legitimately needs to read.
-- =====================================================================
alter table public.profiles                enable row level security;
alter table public.tracks                  enable row level security;
alter table public.merch_products          enable row level security;
alter table public.merch_variants          enable row level security;
alter table public.orders                  enable row level security;
alter table public.order_items             enable row level security;
alter table public.merch_order_items       enable row level security;
alter table public.purchased_tracks        enable row level security;
alter table public.dubstore_section_tracks enable row level security;
alter table public.dubstore_hero_slides    enable row level security;

-- profiles: a user can read/update only their own row
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- tracks: anyone may read (shop + previews). Writes are service-role only.
drop policy if exists "tracks_public_select" on public.tracks;
create policy "tracks_public_select" on public.tracks
  for select using (true);

-- merch catalogue: public read
drop policy if exists "merch_products_public_select" on public.merch_products;
create policy "merch_products_public_select" on public.merch_products
  for select using (true);
drop policy if exists "merch_variants_public_select" on public.merch_variants;
create policy "merch_variants_public_select" on public.merch_variants
  for select using (true);

-- dubstore curation: public read (used to render store sections)
drop policy if exists "dubstore_sections_public_select" on public.dubstore_section_tracks;
create policy "dubstore_sections_public_select" on public.dubstore_section_tracks
  for select using (true);
drop policy if exists "dubstore_hero_public_select" on public.dubstore_hero_slides;
create policy "dubstore_hero_public_select" on public.dubstore_hero_slides
  for select using (true);

-- purchased_tracks: a user may read only their own purchases
drop policy if exists "purchased_tracks_self_select" on public.purchased_tracks;
create policy "purchased_tracks_self_select" on public.purchased_tracks
  for select using (auth.uid() = user_id);

-- orders / order_items / merch_order_items: no anon policies — service role only.

-- =====================================================================
-- STORAGE BUCKETS
-- tracks   -> private (downloads served via short-lived signed URLs)
-- previews -> public  (30s waveform previews)
-- covers   -> public  (artwork)
-- merch    -> public  (product images)
-- =====================================================================
insert into storage.buckets (id, name, public)
values
  ('tracks',   'tracks',   false),
  ('previews', 'previews', true),
  ('covers',   'covers',   true),
  ('merch',    'merch',    true)
on conflict (id) do update set public = excluded.public;
