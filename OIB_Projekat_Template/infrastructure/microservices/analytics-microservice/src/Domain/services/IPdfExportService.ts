import { FiscalReceiptDTO } from "../DTOs/ReceiptDTO";
import { SalesAnalysisReportDTO } from "../DTOs/SalesReportDTO";

export interface IPdfExportService {
  generateReportPdf(report: SalesAnalysisReportDTO): Promise<Buffer>;
  generateReceiptPdf(receipt: FiscalReceiptDTO): Promise<Buffer>;
}
