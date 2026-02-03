export type SalesPeriod = "NEDELJA" | "MESEC" | "GODINA" | "UKUPNO";
export type SummaryDTO = {
  period: SalesPeriod;
  ukupnaProdaja: number;
  ukupnaZarada: number;
  ukupnoParfema: number;
  najjaciDan?: string; 
};

