-- Supabase schema for catalog + quote requests
-- Source of truth: src/lib/mock-data.ts and src/types/catalog.ts

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id text primary key,
  category_id text not null references public.categories(id) on update cascade on delete restrict,
  name text not null,
  short_description text not null,
  price_from numeric(12, 2) not null check (price_from >= 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company text,
  email text not null,
  whatsapp text not null,
  product_type text not null,
  dimensions text,
  quantity integer not null check (quantity > 0),
  material text,
  finishing text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists categories_active_sort_idx
  on public.categories (is_active, sort_order, name);

create index if not exists products_category_active_sort_idx
  on public.products (category_id, is_active, sort_order, name);

create index if not exists products_active_sort_idx
  on public.products (is_active, sort_order, name);

create index if not exists quote_requests_created_at_idx
  on public.quote_requests (created_at desc);

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_quote_requests_updated_at
before update on public.quote_requests
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.quote_requests enable row level security;

create policy "Public read active categories"
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Public read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Public insert quote requests"
  on public.quote_requests
  for insert
  to anon, authenticated
  with check (true);

-- Optional: run supabase/rls_quote_requests_insert_hardening.sql to replace the permissive
-- insert policy with basic field validation aligned to the public quote form.
