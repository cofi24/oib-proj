export interface SalesAnalysisReportDTO {
  id: number;
  nazivIzvestaja: string;
  opis: string;
  period: string;
  ukupnaProdaja: number;
  ukupnaZarada: number;
  createdAt: string;
}