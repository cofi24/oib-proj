import { SummaryDTO } from "../DTOs/AnalyticsDTOs/SummaryDTO";
import { TopTenDTO } from "../DTOs/AnalyticsDTOs/TopTenDTO";
import { TrendDTO } from "../DTOs/AnalyticsDTOs/TrendDTO";
import { CreateReportDTO } from "../DTOs/AnalyticsDTOs/CreateReportDTO";
import { ReceiptDTO } from "../DTOs/AnalyticsDTOs/ReceiptsDTO";
import { AnalyticsReportDTO } from "../DTOs/AnalyticsDTOs/AnalyticsReportDTO";


export interface IAnalyticsGateService {
  createReport(body: CreateReportDTO, token?: string): Promise<AnalyticsReportDTO>;
  getReports(token?: string): Promise<AnalyticsReportDTO[]>;
  getReportById(id: number, token?: string): Promise<AnalyticsReportDTO>;
  getSummary(period: string, token?: string): Promise<SummaryDTO>;
  getTrend(token?: string): Promise<TrendDTO[]>;
  getTop10(token?: string): Promise<TopTenDTO[]>;
  getTop10Revenue(token?: string): Promise<TopTenDTO[]>;
  exportPdf(id: number, token?: string): Promise<{ buffer: Buffer; filename: string }>;
  createReceipt(body: ReceiptDTO, token?: string): Promise<ReceiptDTO>;
  exportReceiptPdf(id: number, token?: string): Promise<{ buffer: Buffer; filename: string }>;
  getReceipts(token?: string): Promise<ReceiptDTO[]>;
  getReceiptById(id: number, token?: string): Promise<ReceiptDTO>;
}