"use client";

import { useActionState, useRef, useState } from "react";
import type { Database } from "@/types/database";
import {
  emptyProductFormValues,
  normalizeProductSlug,
  type ProductFormState,
  type ProductFormValues,
} from "@/lib/admin/product-form";

type Category = Database["public"]["Tables"]["categories"]["Row"];

type ProductFormProps = {
  action: (
    state: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  categories: Category[];
  initialValues?: ProductFormValues;
  submitLabel: string;
  idMode?: "editable" | "readonly";
  originalId?: string;
};

export default function ProductForm({
  action,
  categories,
  initialValues = emptyProductFormValues,
  submitLabel,
  idMode = "editable",
  originalId,
}: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    values: initialValues,
  });
  const values = state.values ?? initialValues;
  const slugInputRef = useRef<HTMLInputElement>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(values.id));
  const isReadonlyId = idMode === "readonly";

  return (
    <form action={formAction} className="space-y-6">
      {originalId ? <input type="hidden" name="original_id" value={originalId} /> : null}

      {state.formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.formError}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">Categoria</span>
          <select
            name="category_id"
            defaultValue={values.category_id}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
          >
            <option value="">Selecciona una categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {state.fieldErrors?.category_id ? (
            <p className="text-sm text-red-600">{state.fieldErrors.category_id}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">
            Identificador
          </span>
          <input
            ref={slugInputRef}
            name={isReadonlyId ? undefined : "id"}
            readOnly={isReadonlyId}
            defaultValue={values.id}
            onChange={
              isReadonlyId
                ? undefined
                : (event) => {
                    setSlugTouched(event.target.value.trim().length > 0);
                    event.target.value = normalizeProductSlug(event.target.value);
                  }
            }
            className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ${
              isReadonlyId ? "bg-gray-50 text-gray-600" : ""
            }`}
            placeholder="cajas-personalizadas"
          />
          <p className="text-xs text-gray-500">
            {isReadonlyId
              ? "El identificador se mantiene fijo para evitar enlaces rotos."
              : "Se sugiere automaticamente desde el nombre y se guarda como slug."}
          </p>
          {state.fieldErrors?.id ? (
            <p className="text-sm text-red-600">{state.fieldErrors.id}</p>
          ) : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">Nombre</span>
          <input
            name="name"
            defaultValue={values.name}
            onChange={
              isReadonlyId
                ? undefined
                : (event) => {
                    if (!slugTouched && slugInputRef.current) {
                      slugInputRef.current.value = normalizeProductSlug(
                        event.target.value
                      );
                    }
                  }
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
            placeholder="Cajas microcorrugadas"
          />
          {state.fieldErrors?.name ? (
            <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">
            Precio desde
          </span>
          <input
            name="price_from"
            inputMode="decimal"
            defaultValue={values.price_from}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
            placeholder="15000"
          />
          {state.fieldErrors?.price_from ? (
            <p className="text-sm text-red-600">{state.fieldErrors.price_from}</p>
          ) : null}
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-gray-900">
          Descripcion corta
        </span>
        <textarea
          name="short_description"
          rows={4}
          defaultValue={values.short_description}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
          placeholder="Ideal para packaging, exhibicion y envios con impresion personalizada."
        />
        {state.fieldErrors?.short_description ? (
          <p className="text-sm text-red-600">
            {state.fieldErrors.short_description}
          </p>
        ) : null}
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-900">Orden</span>
          <input
            name="sort_order"
            inputMode="numeric"
            defaultValue={values.sort_order}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
          />
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={values.is_active}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-900">
            Publicar producto como activo
          </span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
