import { FiscalReceiptItemDTO } from "./FiscalReceiptItemDTO";

export class FiscalReceiptDTO {
  id!: number;
  brojRacuna!: string;
  tipProdaje!: string;
  nacinPlacanja!: string;

  ukupnoStavki!: number;
  ukupnaKolicina!: number;
  iznosZaNaplatu!: number;

  items!: FiscalReceiptItemDTO[];

  createdAt!: string;
}
