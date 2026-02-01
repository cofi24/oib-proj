import { CreateFiscalReceiptDTO } from "../DTOs/CreateFiscalReceiptDTO";
import { FiscalReceiptDTO } from "../DTOs/FiscalReceiptDTO";

export interface IFiscalReceiptService {
  create(data: CreateFiscalReceiptDTO): Promise<FiscalReceiptDTO>;
  getAll(): Promise<FiscalReceiptDTO[]>;
  getById(id: number): Promise<FiscalReceiptDTO>;
  exportPdf(id: number): Promise<Buffer>;
}