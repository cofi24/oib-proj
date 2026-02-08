import { CreateFiscalReceiptDTO } from "../DTOs/CreateReceiptDTO";
import { FiscalReceiptDTO } from "../DTOs/ReceiptDTO";

export interface IFiscalReceiptService {
  create(data: CreateFiscalReceiptDTO): Promise<FiscalReceiptDTO>;
  getAll(): Promise<FiscalReceiptDTO[]>;
  getById(id: number): Promise<FiscalReceiptDTO>;
  exportPdf(id: number): Promise<Buffer>;
}