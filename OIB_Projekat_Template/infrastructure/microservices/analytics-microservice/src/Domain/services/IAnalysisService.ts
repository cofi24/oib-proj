import { CreateSalesAnalysisReportDTO } from "../DTOs/CreateReportDTO";
import { SalesAnalysisReportDTO } from "../DTOs/SalesReportDTO";
import { SalesSummaryDTO } from "../DTOs/SummaryDTO";
import { SalesTrendDTO } from "../DTOs/TrendDTO";
import { TopPerfumeDTO } from "../DTOs/TopDTO";

export interface ISalesAnalysisService {
  createReport(data: CreateSalesAnalysisReportDTO): Promise<SalesAnalysisReportDTO>;
  getAllReports(): Promise<SalesAnalysisReportDTO[]>;
  getReportById(id: number): Promise<SalesAnalysisReportDTO>;
  getOrCreateReport(period: string): Promise<SalesAnalysisReportDTO>;
  getSummary(period: string): Promise<SalesSummaryDTO>;
  getTrend(period?: string): Promise<SalesTrendDTO[]>;
  getTop10(): Promise<TopPerfumeDTO[]>;
  getTop10Revenue(): Promise<{ ukupno: number }>;
  exportPdf(id: number): Promise<Buffer>;
}
