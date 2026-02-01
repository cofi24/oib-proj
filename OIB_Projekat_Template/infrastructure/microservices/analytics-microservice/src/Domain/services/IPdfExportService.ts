import { FiscalReceiptDTO } from "../DTOs/FiscalReceiptDTO";
import { SalesAnalysisReportDTO } from "../DTOs/SalesAnalysisReportDTO";

export interface IPdfExportService {
  generateReportPdf(report: SalesAnalysisReportDTO): Promise<Buffer>;
  generateReceiptPdf(receipt: FiscalReceiptDTO): Promise<Buffer>;
}
