export type Product = {
  title: string;
  description: string;
  summary: string;
  price: string;
  rating: string;
  href: string;
  image: string;
  alt: string;
  home?: boolean;
  links?: boolean;
  featured?: boolean;
};

export const gumroadProfile = "https://marianorenteria.gumroad.com/";

export const everythingBundle = {
  name: "Everything Bundle",
  href: "https://marianorenteria.gumroad.com/l/cboiqd",
};

export const products: Product[] = [
  {
    title: "Mentoría Tech Personalizada",
    description:
      "Una videollamada de 45 minutos para destrabar tu carrera en tech: cambio de rol, entrevistas o una decisión difícil.",
    summary: "Una videollamada de 45 minutos para destrabar tu carrera en tech.",
    price: "$15 USD",
    rating: "5.0 · 18 reseñas",
    href: "https://marianorenteria.gumroad.com/l/coach-mentor",
    image: "/images/product-mentoria.png",
    alt: "Mentoría personalizada con Mariano Rentería",
    home: true,
    links: true,
  },
  {
    title: "Guía de bolsillo para el Líder Técnico",
    description:
      "Consejos claros y accionables para líderes técnicos y engineering managers. EPUB y PDF, con actualizaciones de por vida.",
    summary: "Consejos claros y accionables para líderes técnicos y engineering managers.",
    price: "$15 USD",
    rating: "4.9 · 17 reseñas",
    href: "https://marianorenteria.gumroad.com/l/guia-lider-tecnico",
    image: "/images/product-lider.png",
    alt: "Portada de Guía de bolsillo para el Líder Técnico",
    home: true,
    links: true,
  },
  {
    title: "Guía de bolsillo: de Junior a Senior",
    description:
      "Lo que distingue a un senior: generar valor y compartir conocimiento, en lo técnico y en las soft skills.",
    summary: "Lo que distingue a un senior: generar valor y compartir conocimiento.",
    price: "$20 USD",
    rating: "4.8 · 5 reseñas",
    href: "https://marianorenteria.gumroad.com/l/guia-junior-senior",
    image: "/images/product-junior.png",
    alt: "Portada de Guía de bolsillo para crecer de Junior a Senior",
    home: true,
    links: true,
  },
  {
    title: "Revisión de C.V.",
    description: "Dos sesiones de 30 minutos para resaltar tu experiencia y conseguir más entrevistas.",
    summary: "Dos sesiones de 30 minutos para resaltar tu experiencia y conseguir más entrevistas.",
    price: "$20 USD",
    rating: "5.0 · 1 reseña",
    href: "https://marianorenteria.gumroad.com/l/revision-cv",
    image: "/images/product-cv.png",
    alt: "Revisión de CV en línea",
    links: true,
  },
  {
    title: "Executive Advisory Consulting",
    description:
      "Una hora de guía para founders y equipos directivos sobre cómo usar IA en producto, operación y posición competitiva, con notas de la sesión.",
    summary: "Una hora de guía para founders y equipos directivos sobre cómo usar IA.",
    price: "Desde $250 USD",
    rating: "1 hora + notas",
    href: "https://marianorenteria.gumroad.com/l/exec-hour",
    image: "/images/product-exec.png",
    alt: "Executive Advisory Consulting",
    featured: true,
  },
];
