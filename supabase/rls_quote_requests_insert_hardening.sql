-- Optional: tighten public INSERT on quote_requests (run after schema.sql on existing projects).
-- Replaces permissive with_check(true) with basic field checks aligned to the landing form.
-- Does not grant SELECT to anon/authenticated (quotes stay private).

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
    and message is not null
    and length(btrim(message)) >= 1
  );
