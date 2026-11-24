const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

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

/** `5 ene 2025`. Uses UTC so a date-only value does not slip to the previous day. */
export function formatDate(input: Date | string): string {
  const date = asDate(input);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** `5 de enero de 2025`. */
export function formatLongDate(input: Date | string): string {
  const date = asDate(input);
  return `${date.getUTCDate()} de ${MONTHS_LONG[date.getUTCMonth()]} de ${date.getUTCFullYear()}`;
}
