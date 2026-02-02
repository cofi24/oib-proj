import { AnalyticsReportDTO } from "../DTOs/AnalyticsDTOs/AnalyticsReportDTO";
import { AnalyticsSummaryDTO } from "../DTOs/AnalyticsDTOs/AnalyticsSummaryDTO";
import { AnalyticsTrendDTO } from "../DTOs/AnalyticsDTOs/AnalyticsTrendDTO";
import { TopProductDTO } from "../DTOs/AnalyticsDTOs/TopProductDTO";
import { ReceiptDTO } from "../DTOs/AnalyticsDTOs/ReceiptDTO";
import { CreateReportDTO } from "../DTOs/AnalyticsDTOs/CreateReportDTO";

export interface IAnalyticsGatewayService {
  createReport(body: CreateReportDTO, token?: string): Promise<AnalyticsReportDTO>;
  getReports(token?: string): Promise<AnalyticsReportDTO[]>;
  getReportById(id: number, token?: string): Promise<AnalyticsReportDTO>;
  getSummary(period: string, token?: string): Promise<AnalyticsSummaryDTO>;
  getTrend(token?: string): Promise<AnalyticsTrendDTO[]>;
  getTop10(token?: string): Promise<TopProductDTO[]>;
  getTop10Revenue(token?: string): Promise<TopProductDTO[]>;
  exportPdf(id: number, token?: string): Promise<{ buffer: Buffer; filename: string }>;
  createReceipt(body: ReceiptDTO, token?: string): Promise<ReceiptDTO>;
  exportReceiptPdf(id: number, token?: string): Promise<{ buffer: Buffer; filename: string }>;
  getReceipts(token?: string): Promise<ReceiptDTO[]>;
  getReceiptById(id: number, token?: string): Promise<ReceiptDTO>;
}