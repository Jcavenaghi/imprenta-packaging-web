import Link from "next/link";
import { requireAdminSession } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { toggleProductActive } from "./actions";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

type PageProps = {
  searchParams?:
    | Promise<{ created?: string; updated?: string; error?: string }>
    | { created?: string; updated?: string; error?: string };
};

function formatPriceArs(value: string) {
  return Number(value).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

function getNotice(
  params?: { created?: string; updated?: string; error?: string }
) {
  if (params?.created === "1") {
    return {
      tone: "success" as const,
      message: "Producto creado correctamente.",
    };
  }

  if (params?.updated === "1") {
    return {
      tone: "success" as const,
      message: "Producto actualizado correctamente.",
    };
  }

  if (params?.updated === "activated") {
    return {
      tone: "success" as const,
      message: "Producto reactivado correctamente.",
    };
  }

  if (params?.updated === "deactivated") {
    return {
      tone: "success" as const,
      message: "Producto desactivado correctamente.",
    };
  }

  if (params?.error === "config") {
    return {
      tone: "error" as const,
      message:
        "No se pudo completar la accion porque Supabase no esta configurado.",
    };
  }

  if (params?.error === "save") {
    return {
      tone: "error" as const,
      message: "No se pudo actualizar el estado del producto.",
    };
  }

  return null;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  await requireAdminSession();

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const supabase = getSupabaseAdminClient();
  const notice = getNotice(resolvedSearchParams);

  if (!supabase) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona el catalogo administrativo.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Nuevo producto
          </Link>
        </div>

        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
          role="alert"
        >
          Supabase no esta configurado en el servidor. Revisa
          `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
        </div>
      </div>
    );
  }

  let products: Product[] = [];
  let categories: Category[] = [];

  const [{ data: categoryData }, { data: productData }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  categories = categoryData ?? [];
  products = productData ?? [];

  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona el catalogo administrativo.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo producto
        </Link>
      </div>

      {notice ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {notice.message}
        </div>
      ) : null}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <p className="text-sm text-gray-600">
            Total: {products.length} producto{products.length === 1 ? "" : "s"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <h2 className="text-base font-semibold text-gray-900">
              No hay productos cargados
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Crea tu primer producto para empezar a administrar el catalogo.
            </p>
            <div className="mt-4">
              <Link
                href="/admin/products/new"
                className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Crear producto
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Precio desde
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Orden
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const categoryName = categoryMap.get(product.category_id) ?? "Sin categoria";
                  const nextActive = !product.is_active;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="mt-1 text-xs text-gray-500">{product.id}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{categoryName}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-700">
                        {formatPriceArs(product.price_from)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {product.sort_order}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge active={product.is_active} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Editar
                          </Link>
                          <form action={toggleProductActive}>
                            <input type="hidden" name="product_id" value={product.id} />
                            <input
                              type="hidden"
                              name="next_active"
                              value={String(nextActive)}
                            />
                            <button
                              type="submit"
                              className={`rounded-md px-3 py-2 text-sm font-medium ${
                                product.is_active
                                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                              aria-label={`${
                                product.is_active ? "Desactivar" : "Reactivar"
                              } ${product.name}`}
                            >
                              {product.is_active ? "Desactivar" : "Reactivar"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
