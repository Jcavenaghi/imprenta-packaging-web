"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/auth";
import { type ProductFormState } from "@/lib/admin/product-form";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdminSession();

  const rawOriginalId = formData.get("original_id");
  const rawCategoryId = formData.get("category_id");
  const rawName = formData.get("name");
  const rawShortDescription = formData.get("short_description");
  const rawPriceFrom = formData.get("price_from");
  const rawSortOrder = formData.get("sort_order");

  if (typeof rawOriginalId !== "string" || !rawOriginalId.trim()) {
    redirect("/admin/products");
  }

  const originalId = rawOriginalId.trim();
  const values = {
    category_id: typeof rawCategoryId === "string" ? rawCategoryId.trim() : "",
    id: originalId,
    name: typeof rawName === "string" ? rawName.trim() : "",
    short_description:
      typeof rawShortDescription === "string" ? rawShortDescription.trim() : "",
    price_from: typeof rawPriceFrom === "string" ? rawPriceFrom.trim() : "",
    is_active: formData.get("is_active") === "on",
    sort_order: typeof rawSortOrder === "string" ? rawSortOrder.trim() : "0",
  };

  const fieldErrors: ProductFormState["fieldErrors"] = {};

  if (!values.category_id) {
    fieldErrors.category_id = "Selecciona una categoria.";
  }
  if (!values.name) {
    fieldErrors.name = "El nombre es obligatorio.";
  }
  if (!values.short_description) {
    fieldErrors.short_description = "La descripcion corta es obligatoria.";
  }

  const priceFrom = Number(values.price_from.replace(",", "."));
  if (!values.price_from) {
    fieldErrors.price_from = "El precio base es obligatorio.";
  } else if (!Number.isFinite(priceFrom) || priceFrom < 0) {
    fieldErrors.price_from = "Ingresa un numero valido mayor o igual a 0.";
  }

  const sortOrder = values.sort_order ? Number(values.sort_order) : 0;
  if (values.sort_order && !Number.isInteger(sortOrder)) {
    return {
      formError: "El orden debe ser un numero entero.",
      fieldErrors,
      values,
    };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      values,
    };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      formError:
        "Supabase no esta configurado en el servidor. Revisa las variables de entorno.",
      values,
    };
  }

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("id", values.category_id)
    .maybeSingle();

  if (!category) {
    return {
      fieldErrors: {
        category_id: "La categoria seleccionada no existe.",
      },
      values,
    };
  }

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("id", originalId)
    .maybeSingle();

  if (!product) {
    return {
      formError: "El producto ya no existe o no se pudo encontrar.",
      values,
    };
  }

  const { error } = await supabase
    .from("products")
    .update({
      category_id: values.category_id,
      name: values.name,
      short_description: values.short_description,
      price_from: priceFrom.toFixed(2),
      is_active: values.is_active,
      sort_order: sortOrder,
    })
    .eq("id", originalId);

  if (error) {
    return {
      formError: "No pudimos actualizar el producto. Vuelve a intentar.",
      values,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");

  redirect("/admin/products?updated=1");
}
