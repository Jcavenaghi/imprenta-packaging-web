const navItems = [
  { label: "Categorias", href: "#categorias" },
  { label: "Catalogo", href: "#catalogo" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-hairline)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="text-lg font-semibold text-[var(--color-ink)]">
          Imprenta Packaging
        </a>

        <nav aria-label="Navegacion principal" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-[var(--color-charcoal)] transition-colors hover:text-[var(--color-ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#presupuesto" className="btn-primary text-xs sm:text-sm">
          Pedir presupuesto
        </a>
      </div>

      <nav
        aria-label="Navegacion principal movil"
        className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 pb-4 md:hidden sm:px-6 lg:px-8"
      >
        {navItems.map((item) => (
          <a
            key={`mobile-${item.href}`}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-[var(--color-hairline)] px-3 py-2 text-xs font-medium text-[var(--color-charcoal)]"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
