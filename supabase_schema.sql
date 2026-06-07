-- Ejecuta en Supabase > SQL Editor

create table profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text,
  password_hash text not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  match_id text not null,
  home_goals int not null,
  away_goals int not null,
  scorer text,
  minute int,
  created_at timestamptz default now(),
  unique(user_id, match_id)
);

create table results (
  id uuid primary key default gen_random_uuid(),
  match_id text unique not null,
  home_goals int not null,
  away_goals int not null,
  scorer text,
  minute int,
  updated_at timestamptz default now()
);

create table config (
  key text primary key,
  value jsonb not null
);

insert into config (key, value) values ('points', '{"exact":3,"sign":1,"scorer":2,"minute":1}');
insert into profiles (username, display_name, password_hash, is_admin) values ('admin', 'Admin', 'YWRtaW4xMjM=', true);

alter table profiles disable row level security;
alter table bets disable row level security;
alter table results disable row level security;
alter table config disable row level security;
