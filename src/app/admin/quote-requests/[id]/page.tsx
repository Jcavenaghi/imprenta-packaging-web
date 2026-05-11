import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  QUOTE_REQUEST_STATUSES,
  QUOTE_REQUEST_STATUS_LABELS,
  isQuoteRequestStatus,
} from "@/lib/admin/quote-request-status";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { updateQuoteRequestAdmin } from "./actions";

type QuoteRequest = Database["public"]["Tables"]["quote_requests"]["Row"];

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
  searchParams?:
    | Promise<{ notice?: string; code?: string }>
    | { notice?: string; code?: string };
};

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "No registrado";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatText(value: string | null | undefined, fallback = "No informado") {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : fallback;
}

function formatDateTimeInput(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildMailtoLink(request: QuoteRequest) {
  const subject = encodeURIComponent(
    `Seguimiento de presupuesto - ${request.product_type}`
  );
  const body = encodeURIComponent(
    `Hola ${request.full_name},\n\nTe contactamos por tu solicitud de presupuesto de ${request.product_type}.\n\nSaludos.`
  );

  return `mailto:${request.email}?subject=${subject}&body=${body}`;
}

function buildWhatsAppLink(request: QuoteRequest) {
  const phoneDigits = request.whatsapp.replace(/\D+/g, "");

  if (!phoneDigits) {
    return null;
  }

  const text = encodeURIComponent(
    `Hola ${request.full_name}, te escribimos por tu solicitud de presupuesto de ${request.product_type}.`
  );

  return `https://wa.me/${phoneDigits}?text=${text}`;
}

function getStatusLabel(status: string) {
  return isQuoteRequestStatus(status)
    ? QUOTE_REQUEST_STATUS_LABELS[status]
    : status;
}

function getNoticeMessage(notice?: string, code?: string) {
  if (notice === "success" && code === "saved") {
    return {
      tone: "success" as const,
      title: "Cambios guardados",
      description: "La solicitud se actualizo correctamente.",
    };
  }

  if (notice === "error") {
    switch (code) {
      case "missing_supabase":
        return {
          tone: "error" as const,
          title: "Falta configuracion",
          description:
            "No se pudo guardar porque Supabase no esta configurado en el servidor.",
        };
      case "invalid_status":
        return {
          tone: "error" as const,
          title: "Estado invalido",
          description: "Selecciona un estado valido antes de guardar.",
        };
      case "invalid_contacted_at":
        return {
          tone: "error" as const,
          title: "Fecha invalida",
          description: "Revisa la fecha de contacto antes de guardar.",
        };
      case "save_failed":
        return {
          tone: "error" as const,
          title: "No se pudo guardar",
          description:
            "Hubo un error al actualizar la solicitud. Revisa la migracion y vuelve a intentar.",
        };
      default:
        return {
          tone: "error" as const,
          title: "No se pudo completar la accion",
          description: "Intenta nuevamente en unos minutos.",
        };
    }
  }

  return null;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-2 whitespace-pre-line break-words text-sm text-gray-900">
        {value}
      </dd>
    </div>
  );
}

export default async function AdminQuoteRequestDetailPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminSession();

  const { id } = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const supabase = getSupabaseAdminClient();
  const notice = getNoticeMessage(
    resolvedSearchParams?.notice,
    resolvedSearchParams?.code
  );

  if (!supabase) {
    return (
      <div className="max-w-4xl space-y-6">
        <Link
          href="/admin/quote-requests"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline"
        >
          Volver a presupuestos
        </Link>

        <SectionCard title="Error de configuracion">
          <p className="text-sm text-gray-700">
            No se pudo cargar la solicitud porque Supabase no esta configurado
            en el servidor. Revisa `NEXT_PUBLIC_SUPABASE_URL` y
            `SUPABASE_SERVICE_ROLE_KEY`.
          </p>
        </SectionCard>
      </div>
    );
  }

  const { data: request, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="max-w-4xl space-y-6">
        <Link
          href="/admin/quote-requests"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline"
        >
          Volver a presupuestos
        </Link>

        <SectionCard title="No pudimos cargar la solicitud">
          <p className="text-sm text-gray-700">
            Ocurrio un error al consultar la base de datos. Vuelve a intentar
            en unos minutos.
          </p>
        </SectionCard>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl space-y-6">
        <Link
          href="/admin/quote-requests"
          className="inline-flex text-sm font-medium text-blue-600 hover:underline"
        >
          Volver a presupuestos
        </Link>

        <SectionCard title="Solicitud no encontrada">
          <p className="text-sm text-gray-700">
            No encontramos una solicitud de presupuesto con ese identificador.
          </p>
        </SectionCard>
      </div>
    );
  }

  const emailLink = buildMailtoLink(request);
  const whatsappLink = buildWhatsAppLink(request);

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/quote-requests"
        className="inline-flex text-sm font-medium text-blue-600 hover:underline"
      >
        Volver a presupuestos
      </Link>

      {notice ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <p className="font-semibold">{notice.title}</p>
          <p className="mt-1">{notice.description}</p>
        </div>
      ) : null}

      <SectionCard title="Solicitud de presupuesto">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">ID: {request.id}</p>
            <p className="text-sm text-gray-600">
              Recibida el {formatDateTime(request.created_at)}
            </p>
            <p className="text-sm text-gray-600">
              Actualizada el {formatDateTime(request.updated_at)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {getStatusLabel(request.status)}
            </span>
            <a
              href={emailLink}
              className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Enviar email
            </a>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Abrir WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Gestion interna">
        <form action={updateQuoteRequestAdmin} className="space-y-5">
          <input type="hidden" name="quoteRequestId" value={request.id} />

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-900">Estado</span>
              <select
                name="status"
                defaultValue={request.status}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              >
                {QUOTE_REQUEST_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {QUOTE_REQUEST_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-900">
                Contactado el
              </span>
              <input
                type="datetime-local"
                name="contacted_at"
                defaultValue={formatDateTimeInput(request.contacted_at)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              />
            </label>
          </div>

          <label className="space-y-2 block">
            <span className="text-sm font-medium text-gray-900">
              Notas internas
            </span>
            <textarea
              name="admin_notes"
              defaultValue={request.admin_notes ?? ""}
              rows={6}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              placeholder="Notas internas visibles solo en admin."
            />
          </label>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Datos del cliente">
        <dl className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Fecha" value={formatDateTime(request.created_at)} />
          <DetailItem label="Nombre completo" value={request.full_name} />
          <DetailItem label="Empresa" value={formatText(request.company)} />
          <DetailItem label="Email" value={request.email} />
          <DetailItem label="WhatsApp" value={request.whatsapp} />
          <DetailItem label="Producto" value={request.product_type} />
          <DetailItem label="Medidas" value={formatText(request.dimensions)} />
          <DetailItem
            label="Cantidad"
            value={request.quantity.toLocaleString("es-AR")}
          />
          <DetailItem label="Material" value={formatText(request.material)} />
          <DetailItem label="Terminacion" value={formatText(request.finishing)} />
          <DetailItem
            label="Estado"
            value={getStatusLabel(request.status)}
          />
          <DetailItem
            label="Contactado el"
            value={formatDateTime(request.contacted_at)}
          />
        </dl>
      </SectionCard>

      <SectionCard title="Mensaje del cliente">
        <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
          {formatText(request.message, "Sin mensaje adicional.")}
        </p>
      </SectionCard>

      <SectionCard title="Notas internas">
        <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
          {formatText(request.admin_notes, "Sin notas internas.")}
        </p>
      </SectionCard>
    </div>
  );
}
