import { GetCatalogDTO } from "../../models/sales/GetCatalogDTO";
import { BuyRequestDTO } from "../../models/sales/BuyRequestDTO";
import { ReceiptResponse } from "../../types/ReceiptResponse";
import { ProductResponse } from "../../types/ProductRespones";

export interface ISalesAPI {
   getCatalog(token: string, query: GetCatalogDTO): Promise<ProductResponse[]>;
  buy(token: string, payload: BuyRequestDTO): Promise<ReceiptResponse>;
}


