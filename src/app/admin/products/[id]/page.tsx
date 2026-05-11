import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/product-form";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  type ProductFormValues,
} from "@/lib/admin/product-form";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { updateProduct } from "./actions";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

function getInitialValues(product: Product): ProductFormValues {
  return {
    category_id: product.category_id,
    id: product.id,
    name: product.name,
    short_description: product.short_description,
    price_from: product.price_from,
    is_active: product.is_active,
    sort_order: String(product.sort_order),
  };
}

export default async function AdminEditProductPage({ params }: PageProps) {
  await requireAdminSession();

  const { id } = await Promise.resolve(params);
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <div className="max-w-4xl space-y-6">
        <Link
          href="/admin/products"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline"
        >
          Volver a productos
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Supabase no esta configurado en el servidor. Revisa
          `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
        </div>
      </div>
    );
  }

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (!product) {
    notFound();
  }

  const categoryRows: Category[] = categories ?? [];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 text-sm">
        <Link
          href="/admin/products"
          className="inline-flex font-medium text-blue-600 hover:underline"
        >
          Volver a productos
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex font-medium text-gray-600 hover:text-gray-900"
        >
          Cancelar
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
          <p className="mt-2 text-sm text-gray-600">
            Actualiza los datos del producto seleccionado.
          </p>
        </div>

        {categoryRows.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            No hay categorias disponibles. Carga categorias antes de editar un
            producto.
          </div>
        ) : (
          <ProductForm
            action={updateProduct}
            categories={categoryRows}
            initialValues={getInitialValues(product)}
            submitLabel="Guardar cambios"
            idMode="readonly"
            originalId={product.id}
          />
        )}
      </div>
    </div>
  );
}
