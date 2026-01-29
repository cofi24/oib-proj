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

export class AnalyticsClient {
  constructor(private readonly baseUrl: string) {}

  async createReceipt(
    payload: AnalyticsReceiptRequest
  ): Promise<ReceiptResponse> {
    const url = `${this.baseUrl}/api/v1/analytics/receipt`;

    let res: Response;

    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

    return res.json();
  }
}
