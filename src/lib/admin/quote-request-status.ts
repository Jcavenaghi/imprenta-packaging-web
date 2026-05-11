export const QUOTE_REQUEST_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "closed",
  "archived",
] as const;

export type QuoteRequestStatus = (typeof QUOTE_REQUEST_STATUSES)[number];

export const QUOTE_REQUEST_STATUS_LABELS: Record<QuoteRequestStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  quoted: "Cotizado",
  closed: "Cerrado",
  archived: "Archivado",
};

export function isQuoteRequestStatus(
  value: string
): value is QuoteRequestStatus {
  return QUOTE_REQUEST_STATUSES.includes(value as QuoteRequestStatus);
}
