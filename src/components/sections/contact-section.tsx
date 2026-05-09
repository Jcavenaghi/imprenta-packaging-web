import { contactInfo } from "@/lib/mock-data";

export function ContactSection() {
  return (
    <section id="contacto" className="bg-[var(--color-ink)] py-16 text-white sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Contacto directo</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Hablemos de tu proximo proyecto
            </h2>
            <p className="mt-3 text-sm text-white/80 sm:text-base">
              Si ya tienes una idea o necesitas ayuda para definir especificaciones, nuestro equipo
              comercial puede asesorarte y preparar una propuesta.
            </p>
          </div>

          <div className="card-surface space-y-4 bg-white p-6 text-[var(--color-ink)]">
            <a
              href={contactInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary block text-center"
            >
              Escribir por WhatsApp
            </a>
            <a href={`mailto:${contactInfo.email}`} className="btn-outline block text-center">
              Enviar email
            </a>
            <p className="text-sm text-[var(--color-charcoal)]">
              WhatsApp: {contactInfo.whatsapp}
              <br />
              Email: {contactInfo.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
