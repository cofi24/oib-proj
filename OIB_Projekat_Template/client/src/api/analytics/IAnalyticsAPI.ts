import { TopDTO } from "../../models/analytics/TopDTO";
import { TrendDTO } from "../../models/analytics/TrendDTO";
import { SummaryDTO } from "../../models/analytics/SummaryDTO";
import { ReceiptDTO } from "../../models/analytics/ReceiptDTO";
import { ReportDTO } from "../../models/analytics/ReportDTO";
import { SalesPeriod } from "../../models/analytics/SummaryDTO";


export interface IAnalyticsAPI {
 
  getReports(token: string): Promise<ReportDTO[]>;
  getReportById(token: string, id: number): Promise<ReportDTO>;
  exportReportPdf(token: string, id: number): Promise<Blob>;
  createReport(token: string,data: Omit<ReportDTO, "id" | "createdAt">): Promise<ReportDTO>;
  getSummary(token: string, period: SalesPeriod): Promise<SummaryDTO>;
  getTrend(token: string,period?:SalesPeriod): Promise<TrendDTO[]>;
  getTop10(token: string): Promise<TopDTO[]>;
  getTop10Revenue(token: string): Promise<{ ukupno: number }>;
  exportReceiptPdf(token: string, id: number): Promise<Blob>;
  getReceipts(token: string): Promise<ReceiptDTO[]>;
  getReceiptById(token: string, id: number): Promise<ReceiptDTO>;
}