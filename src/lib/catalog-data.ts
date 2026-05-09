import {
  categories as mockCategories,
  featuredProducts as mockProducts,
} from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types/catalog";

function parsePriceFrom(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Loads catalog for the home page: active categories and products from Supabase when
 * configured and the request succeeds; otherwise falls back to mock data.
 */
export async function getCatalogForHome(): Promise<{ categories: Category[]; products: Product[] }> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { categories: mockCategories, products: mockProducts };
  }

  try {
    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from("categories")
        .select("id,name,description")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("products")
        .select("id,category_id,name,short_description,price_from")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (categoriesResult.error || productsResult.error) {
      return { categories: mockCategories, products: mockProducts };
    }

    const categories: Category[] = (categoriesResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
    }));

    const activeCategoryIds = new Set(categories.map((c) => c.id));

    const products: Product[] = (productsResult.data ?? [])
      .filter((row) => activeCategoryIds.has(row.category_id))
      .map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        shortDescription: row.short_description,
        priceFrom: parsePriceFrom(row.price_from),
      }));

    return { categories, products };
  } catch {
    return { categories: mockCategories, products: mockProducts };
  }
}
