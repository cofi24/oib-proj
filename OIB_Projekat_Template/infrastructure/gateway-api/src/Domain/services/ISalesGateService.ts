import { GetCatalogDTO } from "../DTOs/SalesDTOs/GetCatalogDTO";
import { BuyRequestDTO } from "../DTOs/SalesDTOs/BuyRequestDTO";
import { ProductResponse } from "../types/SalesTypes/ProductResponse";
import { ReceiptResponse } from "../types/SalesTypes/ReceiptResponse";

export interface ISalesGateService {
  getCatalog(query: GetCatalogDTO, headers: Record<string, string>): Promise<ProductResponse[]>;
  buy(payload: BuyRequestDTO, headers: Record<string, string>): Promise<ReceiptResponse>;
}