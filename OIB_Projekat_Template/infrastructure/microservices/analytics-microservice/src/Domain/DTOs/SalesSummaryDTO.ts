export interface SalesSummaryDTO {
  period: "NEDELJA" | "MESEC" | "GODINA" | "UKUPNO";
  ukupnaProdaja: number;
  ukupnaZarada: number;
  ukupnoParfema: number;
}
