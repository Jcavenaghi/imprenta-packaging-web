"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/auth";
import {
  normalizeProductSlug,
  type ProductFormState,
} from "@/lib/admin/product-form";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdminSession();

  const rawCategoryId = formData.get("category_id");
  const rawId = formData.get("id");
  const rawName = formData.get("name");
  const rawShortDescription = formData.get("short_description");
  const rawPriceFrom = formData.get("price_from");
  const rawSortOrder = formData.get("sort_order");

  const values = {
    category_id: typeof rawCategoryId === "string" ? rawCategoryId.trim() : "",
    id: typeof rawId === "string" ? normalizeProductSlug(rawId) : "",
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
  if (!values.id) {
    fieldErrors.id = "El identificador es obligatorio.";
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

  const { error } = await supabase.from("products").insert({
    category_id: values.category_id,
    id: values.id,
    name: values.name,
    short_description: values.short_description,
    price_from: priceFrom.toFixed(2),
    is_active: values.is_active,
    sort_order: sortOrder,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        fieldErrors: {
          id: "Ya existe un producto con ese identificador.",
        },
        values,
      };
    }

    return {
      formError: "No pudimos crear el producto. Vuelve a intentar.",
      values,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");

  redirect("/admin/products?created=1");
}
