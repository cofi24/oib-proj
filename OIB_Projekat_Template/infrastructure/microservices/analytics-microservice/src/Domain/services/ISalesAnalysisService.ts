import { CreateSalesAnalysisReportDTO } from "../DTOs/CreateSalesAnalysisReport.DTO";
import { SalesAnalysisReportDTO } from "../DTOs/SalesAnalysisReportDTO";
import { SalesSummaryDTO } from "../DTOs/SalesSummaryDTO";
import { SalesTrendDTO } from "../DTOs/SalesTrendDTO";
import { TopPerfumeDTO } from "../DTOs/TopPerfumeDTO";

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
