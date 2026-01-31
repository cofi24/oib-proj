import axios,{AxiosError, AxiosInstance} from 'axios';
import { GetCatalogDTO } from '../../Domain/DTOs/SalesDTOs/GetCatalogDTO';
import { BuyRequestDTO } from '../../Domain/DTOs/SalesDTOs/BuyRequestDTO';
import { ProductResponse } from '../../Domain/types/SalesTypes/ProductResponse';
import { ReceiptResponse } from '../../Domain/types/SalesTypes/ReceiptResponse';
import { ISalesGateService } from '../../Domain/services/ISalesGateService';

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function handleAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<any>;
    const status = ax.response?.status ?? 500;
    const message =
      ax.response?.data?.message ||
      ax.response?.data?.error ||
      ax.message ||
      "Sales service request failed";

    const e = new Error(message);
    (e as any).status = status;
    (e as any).details = ax.response?.data;
    throw e;
  }
  throw err instanceof Error ? err : new Error("Unknown error");
}

export class SalesGateService implements ISalesGateService {
  private client: AxiosInstance;

  constructor() {
    const base = normalizeUrl(process.env.SALES_SERVICE_API);
    if (!base) throw new Error("SALES_SERVICE_API not configured");

    this.client = axios.create({
      baseURL: `${base}/sales`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
  }

  async getCatalog(query: GetCatalogDTO, headers: Record<string, string>): Promise<ProductResponse[]> {
    try {
      const resp = await this.client.get("/catalog", { params: query, headers });
      return resp.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async buy(payload: BuyRequestDTO, headers: Record<string, string>): Promise<ReceiptResponse> {
    try {
        console.log("BUY URL:", this.client.defaults.baseURL + "/buy");
console.log("BUY PAYLOAD:", payload);
console.log("BUY HEADERS:", headers);

      const resp = await this.client.post("/buy", payload, { headers });
      return resp.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }
}