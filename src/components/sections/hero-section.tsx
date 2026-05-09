export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-10 top-10 hidden h-36 w-20 -skew-x-[24deg] bg-[var(--color-primary)] lg:block" />
      <div className="pointer-events-none absolute -right-10 bottom-10 hidden h-36 w-20 -skew-x-[24deg] bg-[var(--color-primary)] lg:block" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Impresion y packaging para empresas
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--color-ink)] sm:text-5xl">
            Potencia tu marca con packaging profesional
          </h1>
          <p className="max-w-xl text-base text-[var(--color-charcoal)] sm:text-lg">
            Desarrollamos soluciones de impresion comercial y packaging personalizado para
            ecommerce, retail y empresas en crecimiento.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#presupuesto" className="btn-primary text-center">
              Pedir presupuesto
            </a>
            <a href="#catalogo" className="btn-outline text-center">
              Ver catalogo
            </a>
          </div>
        </div>

        <div className="card-surface bg-[var(--color-cloud)] p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Produccion comercial
          </p>
          <p className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
            Soluciones listas para cotizar
          </p>
          <p className="mt-3 text-sm text-[var(--color-charcoal)]">
            Cajas, bolsas, etiquetas y papeleria institucional con enfoque en calidad, plazos
            claros y asesoramiento tecnico.
          </p>
        </div>
      </div>
    </section>
  );
}
