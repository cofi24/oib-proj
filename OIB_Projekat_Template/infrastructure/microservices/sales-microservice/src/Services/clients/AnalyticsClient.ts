import { PaymentMethod } from "../../Domain/enums/PaymentMethod";
import { SaleType } from "../../Domain/enums/SaleType";
import { ReceiptResponse } from "../../Domain/types/ReceiptResponse";

export type AnalyticsReceiptRequest = {
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  grandTotal: number;
};

type AnalyticsCreateFiscalReceiptDTO = {
  brojRacuna: string;
  tipProdaje: string;
  nacinPlacanja: string;
  items: Array<{
    perfumeId: number;
    perfumeName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

type AnalyticsFiscalReceiptResponse = {
  id: number;
  brojRacuna: string;
  tipProdaje: string;
  nacinPlacanja: string;
  ukupnoStavki: number;
  ukupnaKolicina: number;
  iznosZaNaplatu: number;
  items: Array<{
    perfumeId: number;
    perfumeName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  createdAt: string;
};

export class AnalyticsClient {
  constructor(private readonly baseUrl: string) {}

  async createReceipt(
    payload: AnalyticsReceiptRequest
  ): Promise<ReceiptResponse> {
    const url = `${this.baseUrl}/api/v1/analytics/receipts`;
 // ✅ brojRacuna je OBAVEZAN u analytics-u
    const brojRacuna = `RN-${Date.now()}`;
     // ✅ mapiranje sales -> analytics DTO
    const dto: AnalyticsCreateFiscalReceiptDTO = {
      brojRacuna,
      tipProdaje: payload.saleType,
      nacinPlacanja: payload.paymentMethod,
      items: payload.items.map((i) => ({
        perfumeId: i.productId,
        perfumeName: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.total,
      })),
    };
    let res: Response;

    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
    } catch (err: any) {
      // OVO JE KLJUČNO: jasna poruka šta je puklo
      throw new Error(
        `Analytics fetch failed (${url}): ${err?.message ?? err}`
      );
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Analytics error (${res.status}) at ${url}: ${text}`
      );
    }
      const saved: AnalyticsFiscalReceiptResponse = await res.json();

    // ✅ mapiranje analytics response -> sales ReceiptResponse
    const receiptItems = saved.items.map((it) => ({
      productId: it.perfumeId,
      name: it.perfumeName,
      quantity: it.quantity,
      unitPrice: Number(it.unitPrice),
      total: Number(it.lineTotal),
    }));

    const grandTotal = Number(saved.iznosZaNaplatu);

    return {
      receiptId: saved.brojRacuna,      // ili String(saved.id) ako ti je lakše
      createdAt: saved.createdAt,
      saleType: payload.saleType,
      paymentMethod: payload.paymentMethod,
      items: receiptItems,
      grandTotal,
    };
    
  }
}
