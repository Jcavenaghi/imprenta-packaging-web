"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

const productTypes = [
  "Caja personalizada",
  "Etiqueta / Sticker",
  "Bolsa impresa",
  "Papeleria comercial",
  "Otro",
];

type QuoteRequestInsert = Database["public"]["Tables"]["quote_requests"]["Insert"];

export function QuoteFormSection() {
  const supabaseReady = useMemo(() => isSupabaseConfigured(), []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!supabaseReady) {
      setErrorMessage("Supabase is not configured yet.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage("Supabase is not configured yet.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const productType = String(formData.get("productType") ?? "").trim();
    const dimensions = String(formData.get("dimensions") ?? "").trim();
    const quantityValue = String(formData.get("quantity") ?? "").trim();
    const material = String(formData.get("material") ?? "").trim();
    const finishing = String(formData.get("finishing") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const quantity = Number(quantityValue);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) {
      setErrorMessage("Por favor ingresa tu nombre y apellido.");
      return;
    }

    if (!email || !emailRegex.test(email)) {
      setErrorMessage("Por favor ingresa un email valido.");
      return;
    }

    if (!productType) {
      setErrorMessage("Por favor selecciona un tipo de producto.");
      return;
    }

    if (!quantityValue || Number.isNaN(quantity) || quantity <= 0) {
      setErrorMessage("Por favor ingresa una cantidad valida.");
      return;
    }

    if (!message) {
      setErrorMessage("Por favor agrega el mensaje con los detalles del pedido.");
      return;
    }

    const payload: QuoteRequestInsert = {
      full_name: fullName,
      company: company || null,
      email,
      whatsapp: whatsapp || "",
      product_type: productType,
      dimensions: dimensions || null,
      quantity,
      material: material || null,
      finishing: finishing || null,
      message,
    };

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("quote_requests").insert(payload);

      if (error) {
        setErrorMessage("No pudimos enviar tu solicitud. Intenta nuevamente en unos minutos.");
        return;
      }

      form.reset();
      setSuccessMessage("Tu solicitud fue enviada correctamente. Te contactaremos a la brevedad.");
    } catch {
      setErrorMessage("No pudimos enviar tu solicitud. Revisa tu conexion e intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="presupuesto" className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Presupuesto
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Solicita tu cotizacion personalizada
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-surface grid gap-4 p-6 sm:grid-cols-2"
          noValidate
          aria-busy={isSubmitting}
        >
          {!supabaseReady ? (
            <p className="sm:col-span-2 text-sm text-[var(--color-charcoal)]" role="status">
              Supabase is not configured yet.
            </p>
          ) : null}

          <label className="form-field">
            <span>Nombre y apellido</span>
            <input
              className="form-input"
              type="text"
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
            />
          </label>

          <label className="form-field">
            <span>Empresa/emprendimiento</span>
            <input className="form-input" type="text" id="company" name="company" autoComplete="organization" />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
            />
          </label>

          <label className="form-field">
            <span>WhatsApp</span>
            <input
              className="form-input"
              type="tel"
              id="whatsapp"
              name="whatsapp"
              autoComplete="tel"
              inputMode="tel"
            />
          </label>

          <label className="form-field">
            <span>Tipo de producto</span>
            <select className="form-input" id="productType" name="productType" defaultValue="" required>
              <option value="" disabled>
                Selecciona una opcion
              </option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Medidas</span>
            <input
              className="form-input"
              type="text"
              id="dimensions"
              name="dimensions"
              placeholder="Ej. 20x10x8 cm"
            />
          </label>

          <label className="form-field">
            <span>Cantidad</span>
            <input
              className="form-input"
              type="number"
              id="quantity"
              min={1}
              name="quantity"
              inputMode="numeric"
              required
            />
          </label>

          <label className="form-field">
            <span>Material</span>
            <input className="form-input" type="text" id="material" name="material" />
          </label>

          <label className="form-field">
            <span>Terminacion</span>
            <input className="form-input" type="text" id="finishing" name="finishing" />
          </label>

          <label className="form-field sm:col-span-2">
            <span>Mensaje adicional</span>
            <textarea className="form-input min-h-28 resize-y" id="message" name="message" required />
          </label>

          {errorMessage ? (
            <p className="sm:col-span-2 text-sm text-red-700" role="alert" aria-live="polite">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="sm:col-span-2 text-sm text-green-700" role="status" aria-live="polite">
              {successMessage}
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={isSubmitting || !supabaseReady}
            >
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
