export type ProductFormFieldName =
  | "category_id"
  | "id"
  | "name"
  | "short_description"
  | "price_from";

export type ProductFormValues = {
  category_id: string;
  id: string;
  name: string;
  short_description: string;
  price_from: string;
  is_active: boolean;
  sort_order: string;
};

export type ProductFormState = {
  formError?: string;
  fieldErrors?: Partial<Record<ProductFormFieldName, string>>;
  values?: ProductFormValues;
};

export const emptyProductFormValues: ProductFormValues = {
  category_id: "",
  id: "",
  name: "",
  short_description: "",
  price_from: "",
  is_active: true,
  sort_order: "0",
};

export function normalizeProductSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
