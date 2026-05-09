export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: Category["id"];
  shortDescription: string;
  priceFrom: number;
};

export type ServiceBenefit = {
  id: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type ContactInfo = {
  whatsapp: string;
  whatsappHref: string;
  email: string;
};
