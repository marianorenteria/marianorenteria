import type { Product } from "../data/products";
import { en } from "./en";
import { es, type Dictionary } from "./es";
import { type Locale } from "./routes";

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function htmlLang(locale: Locale): "es" | "en" {
  return locale === "en" ? "en" : "es";
}

export function ogLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "es_MX";
}

const enProductCopy: Record<string, { title: string; description: string; summary: string; alt: string }> = {
  "https://marianorenteria.gumroad.com/l/coach-mentor": {
    title: "Personalized tech mentoring",
    description:
      "A 45-minute video call to unblock your career in tech: a role change, interviews, or a hard decision.",
    summary: "A 45-minute video call to unblock your career in tech.",
    alt: "Personalized mentoring with Mariano Rentería",
  },
  "https://marianorenteria.gumroad.com/l/guia-lider-tecnico": {
    title: "Pocket guide for the tech lead",
    description: "Clear, practical advice for tech leads and engineering managers. EPUB and PDF, with lifetime updates.",
    summary: "Clear, practical advice for tech leads and engineering managers.",
    alt: "Cover of the pocket guide for the tech lead",
  },
  "https://marianorenteria.gumroad.com/l/guia-junior-senior": {
    title: "Pocket guide: from junior to senior",
    description: "What sets a senior apart: creating value and sharing knowledge, in the technical work and in the soft skills.",
    summary: "What sets a senior apart: creating value and sharing knowledge.",
    alt: "Cover of the pocket guide for growing from junior to senior",
  },
  "https://marianorenteria.gumroad.com/l/revision-cv": {
    title: "CV review",
    description: "Two 30-minute sessions to highlight your experience and land more interviews.",
    summary: "Two 30-minute sessions to highlight your experience and land more interviews.",
    alt: "Online CV review",
  },
  "https://marianorenteria.gumroad.com/l/exec-hour": {
    title: "Executive Advisory Consulting",
    description:
      "One hour of guidance for founders and leadership teams on using AI in the product, the operation, and competitive position, with notes from the session.",
    summary: "One hour of guidance for founders and leadership teams on using AI.",
    alt: "Executive Advisory Consulting",
  },
};

export function productCopy(locale: Locale, product: Product) {
  const translated = locale === "en" ? enProductCopy[product.href] : undefined;
  return {
    title: translated?.title ?? product.title,
    description: translated?.description ?? product.description,
    summary: translated?.summary ?? product.summary,
    alt: translated?.alt ?? product.alt,
    price: locale === "en" ? product.price.replace(/^Desde /, "From ") : product.price,
    rating: localizeRating(product.rating, locale),
  };
}

function localizeRating(rating: string, locale: Locale): string {
  if (locale === "es") return rating;
  return rating.replaceAll("reseñas", "reviews").replaceAll("reseña", "review").replace("1 hora + notas", "1 hour + notes");
}
