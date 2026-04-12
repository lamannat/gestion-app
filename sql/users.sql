create table if not exists public.users (
  id uuid primary key,
  username text not null unique,
  password text not null
);
