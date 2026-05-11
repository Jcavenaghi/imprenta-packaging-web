"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/auth";
import { isQuoteRequestStatus } from "@/lib/admin/quote-request-status";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function buildRedirectUrl(
  quoteRequestId: string,
  kind: "success" | "error",
  code: string
) {
  const params = new URLSearchParams({
    notice: kind,
    code,
  });

  return `/admin/quote-requests/${quoteRequestId}?${params.toString()}`;
}

export async function updateQuoteRequestAdmin(formData: FormData) {
  await requireAdminSession();

  const quoteRequestId = formData.get("quoteRequestId");
  const status = formData.get("status");
  const adminNotes = formData.get("admin_notes");
  const contactedAt = formData.get("contacted_at");

  if (
    typeof quoteRequestId !== "string" ||
    typeof status !== "string" ||
    typeof adminNotes !== "string" ||
    typeof contactedAt !== "string"
  ) {
    redirect("/admin/quote-requests");
  }

  if (!isQuoteRequestStatus(status)) {
    redirect(buildRedirectUrl(quoteRequestId, "error", "invalid_status"));
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    redirect(buildRedirectUrl(quoteRequestId, "error", "missing_supabase"));
  }

  let contactedAtValue: string | null = null;
  const trimmedContactedAt = contactedAt.trim();

  if (trimmedContactedAt) {
    const parsedDate = new Date(trimmedContactedAt);

    if (Number.isNaN(parsedDate.getTime())) {
      redirect(buildRedirectUrl(quoteRequestId, "error", "invalid_contacted_at"));
    }

    contactedAtValue = parsedDate.toISOString();
  }

  const trimmedAdminNotes = adminNotes.trim();

  const { error } = await supabase
    .from("quote_requests")
    .update({
      status,
      admin_notes: trimmedAdminNotes ? trimmedAdminNotes : null,
      contacted_at: contactedAtValue,
    })
    .eq("id", quoteRequestId);

  if (error) {
    redirect(buildRedirectUrl(quoteRequestId, "error", "save_failed"));
  }

  revalidatePath("/admin/quote-requests");
  revalidatePath(`/admin/quote-requests/${quoteRequestId}`);

  redirect(buildRedirectUrl(quoteRequestId, "success", "saved"));
}
