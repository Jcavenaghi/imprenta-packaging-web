import type {
  Category,
  ContactInfo,
  ProcessStep,
  Product,
  ServiceBenefit,
} from "@/types/catalog";

export const categories: Category[] = [
  {
    id: "cajas",
    name: "Cajas Personalizadas",
    description: "Packaging para envios, retail y presentacion de marca.",
  },
  {
    id: "etiquetas",
    name: "Etiquetas y Stickers",
    description: "Etiquetas en bobina o plancha para productos y packaging.",
  },
  {
    id: "bolsas",
    name: "Bolsas Impresas",
    description: "Bolsas de papel y kraft con impresion comercial.",
  },
  {
    id: "papeleria",
    name: "Papeleria Comercial",
    description: "Tarjetas, folletos, carpetas y material institucional.",
  },
];

export const featuredProducts: Product[] = [
  {
    id: "caja-microcorrugado",
    name: "Caja Microcorrugado Premium",
    categoryId: "cajas",
    shortDescription: "Ideal para ecommerce y suscripciones con excelente presencia.",
    priceFrom: 680,
  },
  {
    id: "etiqueta-vinilo",
    name: "Etiqueta Vinilo Resistente",
    categoryId: "etiquetas",
    shortDescription: "Alta durabilidad para productos de uso intensivo.",
    priceFrom: 120,
  },
  {
    id: "bolsa-kraft",
    name: "Bolsa Kraft Reforzada",
    categoryId: "bolsas",
    shortDescription: "Terminacion profesional para tiendas y eventos corporativos.",
    priceFrom: 490,
  },
  {
    id: "catalogo-corporativo",
    name: "Catalogo Corporativo Grapado",
    categoryId: "papeleria",
    shortDescription: "Comunicacion visual de productos y servicios en formato impreso.",
    priceFrom: 950,
  },
];

export const serviceBenefits: ServiceBenefit[] = [
  {
    id: "asesoria",
    title: "Asesoria tecnica",
    description: "Te ayudamos a elegir materiales, medidas y terminaciones.",
  },
  {
    id: "calidad",
    title: "Calidad consistente",
    description: "Procesos estandarizados para mantener color y acabado en cada tirada.",
  },
  {
    id: "entregas",
    title: "Entregas planificadas",
    description: "Coordinamos tiempos de produccion y entrega segun tu operacion.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "paso-1",
    title: "Contanos tu necesidad",
    description: "Completas el formulario con producto, medidas y cantidad estimada.",
  },
  {
    id: "paso-2",
    title: "Recibi una propuesta",
    description: "Enviamos cotizacion con alternativas de material y terminacion.",
  },
  {
    id: "paso-3",
    title: "Aprobacion y produccion",
    description: "Una vez aprobada la propuesta, iniciamos la produccion.",
  },
];

export const contactInfo: ContactInfo = {
  whatsapp: "+54 9 11 2345-6789",
  whatsappHref: "https://wa.me/5491123456789",
  email: "ventas@imprenta-packaging.com",
};
