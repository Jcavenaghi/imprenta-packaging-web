-- Seed catalog from src/lib/mock-data.ts (names, descriptions, prices, list order).
-- Run after supabase/schema.sql. Safe to re-run: upserts by primary key.
-- IDs use readable slugs (not the shorter mock fallback ids used only in TypeScript).

insert into public.categories (id, name, description, is_active, sort_order)
values
  (
    'cajas-personalizadas',
    'Cajas Personalizadas',
    'Packaging para envios, retail y presentacion de marca.',
    true,
    0
  ),
  (
    'etiquetas-y-stickers',
    'Etiquetas y Stickers',
    'Etiquetas en bobina o plancha para productos y packaging.',
    true,
    1
  ),
  (
    'bolsas-impresas',
    'Bolsas Impresas',
    'Bolsas de papel y kraft con impresion comercial.',
    true,
    2
  ),
  (
    'papeleria-comercial',
    'Papeleria Comercial',
    'Tarjetas, folletos, carpetas y material institucional.',
    true,
    3
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.products (
  id,
  category_id,
  name,
  short_description,
  price_from,
  is_active,
  sort_order
)
values
  (
    'caja-microcorrugado-premium',
    'cajas-personalizadas',
    'Caja Microcorrugado Premium',
    'Ideal para ecommerce y suscripciones con excelente presencia.',
    680.00,
    true,
    0
  ),
  (
    'etiqueta-vinilo-resistente',
    'etiquetas-y-stickers',
    'Etiqueta Vinilo Resistente',
    'Alta durabilidad para productos de uso intensivo.',
    120.00,
    true,
    1
  ),
  (
    'bolsa-kraft-reforzada',
    'bolsas-impresas',
    'Bolsa Kraft Reforzada',
    'Terminacion profesional para tiendas y eventos corporativos.',
    490.00,
    true,
    2
  ),
  (
    'catalogo-corporativo-grapado',
    'papeleria-comercial',
    'Catalogo Corporativo Grapado',
    'Comunicacion visual de productos y servicios en formato impreso.',
    950.00,
    true,
    3
  )
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  short_description = excluded.short_description,
  price_from = excluded.price_from,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;
