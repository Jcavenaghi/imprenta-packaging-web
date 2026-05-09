import type { Category } from "@/types/catalog";

type CategoriesSectionProps = {
  categories: Category[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section id="categorias" className="bg-[var(--color-cloud)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Categorias
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Lineas de productos
          </h2>
        </div>

        {categories.length === 0 ? (
          <p className="text-base text-[var(--color-charcoal)]">
            No hay categorias disponibles por el momento.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article key={category.id} className="card-surface p-5">
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">{category.name}</h3>
                <p className="mt-2 text-sm text-[var(--color-charcoal)]">{category.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
