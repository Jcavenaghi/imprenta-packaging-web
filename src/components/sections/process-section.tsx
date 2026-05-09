import { processSteps } from "@/lib/mock-data";

export function ProcessSection() {
  return (
    <section id="proceso" className="bg-[var(--color-cloud)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Como trabajamos
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Proceso simple y claro
          </h2>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.id} className="card-surface p-6">
              <p className="text-sm font-semibold text-[var(--color-primary)]">Paso {index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--color-ink)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-charcoal)]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
