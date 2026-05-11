import Link from "next/link";
import ProductForm from "@/components/admin/product-form";
import { requireAdminSession } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { createProduct } from "./actions";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export default async function AdminNewProductPage() {
  await requireAdminSession();

  const supabase = getSupabaseAdminClient();
  let categories: Category[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    categories = data ?? [];
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex text-sm font-medium text-blue-600 hover:underline"
      >
        Volver a productos
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Crear producto</h1>
          <p className="mt-2 text-sm text-gray-600">
            Crea un producto nuevo para el catalogo administrativo.
          </p>
        </div>

        {!supabase ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Supabase no esta configurado en el servidor. Revisa
            `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            No hay categorias disponibles. Carga categorias antes de crear un
            producto.
          </div>
        ) : (
          <ProductForm
            action={createProduct}
            categories={categories}
            submitLabel="Crear producto"
          />
        )}
      </div>
    </div>
  );
}
