-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- USERS  (mirrors Supabase Auth, adds XP)
-- ─────────────────────────────────────────
create table if not exists users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      varchar(255) unique not null,
  xp         int not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create a users row when someone signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- VOCABULARY
-- ─────────────────────────────────────────
create table if not exists vocabulary (
  id         serial primary key,
  german     varchar(255) not null,
  english    varchar(255) not null,
  example    text,
  difficulty smallint not null default 0
);

-- ─────────────────────────────────────────
-- USER PROGRESS  (one row per user × word)
-- ─────────────────────────────────────────
create table if not exists user_progress (
  id             serial primary key,
  user_id        uuid not null references users(id) on delete cascade,
  vocabulary_id  int  not null references vocabulary(id) on delete cascade,
  streak         int  not null default 0,
  last_reviewed  timestamptz not null default now(),
  next_review    timestamptz not null default now(),
  total_reviews  int  not null default 0,
  difficulty     smallint not null default 0,
  unique (user_id, vocabulary_id)
);

-- Index for quick "cards due" queries
create index if not exists idx_user_progress_next_review
  on user_progress (user_id, next_review);

-- ─────────────────────────────────────────
-- HELPER RPC: increment XP atomically
-- ─────────────────────────────────────────
create or replace function increment_user_xp(p_user_id uuid, p_amount int)
returns void language sql security definer as $$
  update users
  set xp = xp + p_amount
  where id = p_user_id;
$$;

-- ─────────────────────────────────────────
-- ROW-LEVEL SECURITY
-- ─────────────────────────────────────────
alter table users         enable row level security;
alter table user_progress enable row level security;
alter table vocabulary    enable row level security;

-- Users can only read/write their own row
create policy "Users: own row" on users
  for all using (auth.uid() = id);

-- Progress: own rows only
create policy "Progress: own rows" on user_progress
  for all using (auth.uid() = user_id);

-- Vocabulary: everyone can read, only service role can write
create policy "Vocabulary: public read" on vocabulary
  for select using (true);
