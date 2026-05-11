"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function toggleProductActive(formData: FormData) {
  await requireAdminSession();

  const rawProductId = formData.get("product_id");
  const rawNextActive = formData.get("next_active");

  if (typeof rawProductId !== "string" || typeof rawNextActive !== "string") {
    redirect("/admin/products");
  }

  const productId = rawProductId.trim();
  const nextActive = rawNextActive === "true";
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    redirect("/admin/products?error=config");
  }

  const { error } = await supabase
    .from("products")
    .update({ is_active: nextActive })
    .eq("id", productId);

  if (error) {
    redirect("/admin/products?error=save");
  }

  revalidatePath("/admin/products");
  revalidatePath("/");

  redirect(`/admin/products?updated=${nextActive ? "activated" : "deactivated"}`);
}
