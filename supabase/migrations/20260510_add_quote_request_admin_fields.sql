alter table public.quote_requests
  add column if not exists admin_notes text,
  add column if not exists contacted_at timestamptz;

alter table public.quote_requests
  drop constraint if exists quote_requests_status_check;

alter table public.quote_requests
  add constraint quote_requests_status_check
  check (status in ('new', 'contacted', 'quoted', 'closed', 'archived'));

drop policy if exists "Public insert quote requests" on public.quote_requests;

create policy "Public insert quote requests"
  on public.quote_requests
  for insert
  to anon, authenticated
  with check (
    length(btrim(full_name)) >= 1
    and length(btrim(email)) >= 3
    and btrim(email) ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(btrim(product_type)) >= 1
    and quantity > 0
    and (
      message is null
      or length(btrim(message)) >= 1
    )
    and status = 'new'
    and admin_notes is null
    and contacted_at is null
  );
