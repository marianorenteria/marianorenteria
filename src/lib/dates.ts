import type { Locale } from "../i18n/routes";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_EN_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_LONG = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function asDate(input: Date | string): Date {
  return input instanceof Date ? input : new Date(input);
}

/** `5 ene 2025` or `Jan 5, 2025`. Uses UTC so a date-only value does not slip to the previous day. */
export function formatDate(input: Date | string, locale: Locale = "es"): string {
  const date = asDate(input);
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  if (locale === "en") return `${MONTHS_EN[date.getUTCMonth()]} ${day}, ${year}`;
  return `${day} ${MONTHS[date.getUTCMonth()]} ${year}`;
}

/** `5 de enero de 2025` or `January 5, 2025`. */
export function formatLongDate(input: Date | string, locale: Locale = "es"): string {
  const date = asDate(input);
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  if (locale === "en") return `${MONTHS_EN_LONG[date.getUTCMonth()]} ${day}, ${year}`;
  return `${day} de ${MONTHS_LONG[date.getUTCMonth()]} de ${year}`;
}
