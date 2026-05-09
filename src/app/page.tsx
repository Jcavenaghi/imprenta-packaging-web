import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { QuoteFormSection } from "@/components/sections/quote-form-section";
import { ServicesSection } from "@/components/sections/services-section";
import { getCatalogForHome } from "@/lib/catalog-data";

export default async function Home() {
  const { categories, products } = await getCatalogForHome();

  return (
    <>
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-ink)]"
      >
        Saltar al contenido principal
      </a>
      <Header />
      <main id="contenido-principal">
        <HeroSection />
        <CategoriesSection categories={categories} />
        <FeaturedProductsSection products={products} />
        <ServicesSection />
        <QuoteFormSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
