import { CreateFiscalReceiptItemDTO } from "./CreateFiscalReceiptItemDTO";

export class CreateFiscalReceiptDTO {
  brojRacuna!: string;
  tipProdaje!: string;
  nacinPlacanja!: string;
  items!: CreateFiscalReceiptItemDTO[];
}