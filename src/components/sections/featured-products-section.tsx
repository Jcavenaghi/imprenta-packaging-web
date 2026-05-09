import type { Product } from "@/types/catalog";

const currencyFormatter = new Intl.NumberFormat("es-AR");

type FeaturedProductsSectionProps = {
  products: Product[];
};

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section id="catalogo" className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-charcoal)]">
            Catalogo destacado
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] sm:text-4xl">
            Productos con precio desde
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-base text-[var(--color-charcoal)]">
            No hay productos en el catalogo por el momento.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="card-surface flex flex-col p-6">
                <p className="text-sm text-[var(--color-charcoal)]">{product.shortDescription}</p>
                <h3 className="mt-3 text-xl font-semibold text-[var(--color-ink)]">{product.name}</h3>
                <p className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">
                  Desde ${currencyFormatter.format(product.priceFrom)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
