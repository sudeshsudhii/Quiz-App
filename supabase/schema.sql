create table if not exists public.app_users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_quizzes (
  id uuid primary key,
  author_id uuid not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists app_quizzes_author_idx on public.app_quizzes (author_id, updated_at desc);

create table if not exists public.app_results (
  id uuid primary key,
  host_id uuid not null,
  data jsonb not null,
  ended_at timestamptz not null default now()
);
create index if not exists app_results_host_idx on public.app_results (host_id, ended_at);

-- The app connects to Postgres directly; block the public API from reading these tables.
alter table public.app_users enable row level security;
alter table public.app_quizzes enable row level security;
alter table public.app_results enable row level security;
