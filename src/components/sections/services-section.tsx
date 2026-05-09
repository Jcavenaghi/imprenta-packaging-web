import { serviceBenefits } from "@/lib/mock-data";

export function ServicesSection() {
  return (
    <section id="servicios" className="bg-[var(--color-fog)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Beneficios
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Por que trabajar con nosotros
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {serviceBenefits.map((benefit) => (
            <article key={benefit.id} className="card-surface p-6">
              <h3 className="text-lg font-semibold text-[var(--color-ink)]">{benefit.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-charcoal)]">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
