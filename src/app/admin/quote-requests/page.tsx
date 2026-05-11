import Link from "next/link";
import { requireAdminSession } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

/**
 * Admin page to list customer quote requests. Provides a link to view details.
 */
export default async function AdminQuoteRequestsPage() {
  await requireAdminSession();
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Solicitudes de presupuesto</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
          Supabase no esta configurado en el servidor. Revisa
          `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
        </div>
      </div>
    );
  }

  let requests: QuoteRequest[] = [];
  const { data } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });
  requests = data ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Solicitudes de presupuesto</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {new Date(req.created_at).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {req.full_name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {req.email}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {req.whatsapp}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {req.product_type}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 capitalize">
                  {req.status}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                  <Link
                    href={`/admin/quote-requests/${req.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500">
                  No hay solicitudes de presupuesto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
