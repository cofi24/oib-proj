import { BuyRequestDTO } from "../DTOs/BuyRequestDTO";
import { GetCatalogDTO } from "../DTOs/GetCatalogDTO";
import { ProductResponse } from "../types/ProductResponse";
import { ReceiptResponse } from "../types/ReceiptResponse";

export interface ISalesService {
  getCatalog(query: GetCatalogDTO, headers: Record<string, string>): Promise<ProductResponse[]>;
  buy(userRole: string, request: BuyRequestDTO): Promise<ReceiptResponse>;
}