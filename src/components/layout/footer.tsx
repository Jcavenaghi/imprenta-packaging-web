import { contactInfo } from "@/lib/mock-data";

export function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] py-12 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold">Imprenta Packaging</p>
          <p className="text-sm text-white/80">
            Soluciones de impresion y packaging para marcas que quieren vender mejor.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/90">Secciones</p>
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <a href="#catalogo">Catalogo</a>
            <a href="#presupuesto">Presupuesto</a>
            <a href="#contacto">Contacto</a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/90">Contactanos</p>
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <a href={contactInfo.whatsappHref} target="_blank" rel="noopener noreferrer">
              WhatsApp: {contactInfo.whatsapp}
            </a>
            <a href={`mailto:${contactInfo.email}`}>Email: {contactInfo.email}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
