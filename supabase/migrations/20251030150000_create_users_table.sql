create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text check (role in ('student', 'instructor', 'admin')) not null,
  is_premium_user boolean default false,
  paid_at timestamptz,
  plan_valid_till timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
