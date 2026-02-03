import { Repository } from "typeorm";
import { FiscalReceipt } from "../Domain/models/FiscalReceipt";
import { IFiscalReceiptService } from "../Domain/services/IFiscalReceiptService";
import { FiscalReceiptDTO } from "../Domain/DTOs/FiscalReceiptDTO";
import { FiscalReceiptItem } from "../Domain/models/FiscalReceiptItem";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { IPdfExportService } from "../Domain/services/IPdfExportService";
import { CreateFiscalReceiptDTO } from "../Domain/DTOs/CreateFiscalReceiptDTO";



export class FiscalReceiptService implements IFiscalReceiptService {
  constructor(
    private readonly repo: Repository<FiscalReceipt>,
    private readonly auditing: IAuditingService,
    private readonly pdf: IPdfExportService
  ) {}

  async create(data: CreateFiscalReceiptDTO): Promise<FiscalReceiptDTO> {
    try {
      console.log("FiscalReceiptService Received data:", JSON.stringify(data, null, 2));

      if (!data.brojRacuna || data.brojRacuna.trim() === "") {
        throw new Error("Account number is required");
      }

      if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        throw new Error("Items are required for the fiscal account.");
      }

      const items: FiscalReceiptItem[] = data.items.map((i) => {
        const unit = Number(i.unitPrice);
        const qty = Number(i.quantity);
        const lineTotal = Number(i.lineTotal || (unit * qty)); 

        if (!i.perfumeId || qty <= 0 || unit <= 0) {
          throw new Error(`Invalid invoice item: ${JSON.stringify(i)}`);
        }

        return Object.assign(new FiscalReceiptItem(), {
          perfumeId: i.perfumeId,
          perfumeName: i.perfumeName,
          quantity: qty,
          unitPrice: unit,
          lineTotal: Number(lineTotal.toFixed(2)),
        });
      });

      const ukupnoStavki = items.length;
      const ukupnaKolicina = items.reduce((s, x) => s + x.quantity, 0);
      const iznosZaNaplatu = Number(
        items.reduce((s, x) => s + Number(x.lineTotal), 0).toFixed(2)
      );

      console.log("[FiscalReceiptService] Creating receipt with:", {
        brojRacuna: data.brojRacuna,
        ukupnoStavki,
        ukupnaKolicina,
        iznosZaNaplatu
      });

      const receipt: FiscalReceipt = this.repo.create({
        brojRacuna: data.brojRacuna,
        tipProdaje: data.tipProdaje,
        nacinPlacanja: data.nacinPlacanja,
        ukupnoStavki,
        ukupnaKolicina,
        iznosZaNaplatu,
        items,
      });

      const saved = await this.repo.save(receipt);

      console.log("FiscalReceiptService Receipt saved successfully:", saved.brojRacuna);

      await this.auditing.log(
        AuditLogType.INFO,
        `[ANALYTICS] Kreiran  račun ${saved.brojRacuna}`
      );

      return this.toDTO(saved);
    } catch (err) {
        let message = "Greška pri kreiranju fiskalnog računa";

        if (err instanceof Error) {
          message = err.message;
        }

        console.error("[FiscalReceiptService] Error:", message);

        await this.auditing.log(
          AuditLogType.ERROR,
          `[ANALYTICS] Greška pri kreiranju fiskalnog računa: ${message}`
        );

        throw new Error(message);
      }
  }

  async getAll(): Promise<FiscalReceiptDTO[]> {
    const list = await this.repo.find({
      order: { createdAt: "DESC" },
      relations: ["items"],
    });
    return list.map((x) => this.toDTO(x));
  }

  async getById(id: number): Promise<FiscalReceiptDTO> {
    const receipt = await this.repo.findOne({
      where: { id },
      relations: ["items"],
    });
    if (!receipt) {
      throw new Error("Fiscal receipt not found");
    }
    return this.toDTO(receipt);
  }

  async exportPdf(id: number): Promise<Buffer> {
    const receipt = await this.getById(id);
    return this.pdf.generateReceiptPdf(receipt);
  }
  
  private toDTO(r: FiscalReceipt): FiscalReceiptDTO {
    return {
      id: r.id,
      brojRacuna: r.brojRacuna,
      tipProdaje: r.tipProdaje,
      nacinPlacanja: r.nacinPlacanja,
      ukupnoStavki: r.ukupnoStavki,
      ukupnaKolicina: r.ukupnaKolicina,
      iznosZaNaplatu: Number(r.iznosZaNaplatu),
      items: (r.items ?? []).map((it: FiscalReceiptItem) => ({
        perfumeId: it.perfumeId,
        perfumeName: it.perfumeName,
        quantity: it.quantity,
        unitPrice: Number(it.unitPrice),
        lineTotal: Number(it.lineTotal),
      })),
      createdAt: r.createdAt.toISOString(),
    };
  }
}