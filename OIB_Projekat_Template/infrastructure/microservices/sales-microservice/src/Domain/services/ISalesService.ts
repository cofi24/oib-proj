import { GetCatalogDTO } from "../DTOs/GetCatalogDTO";
import { ProductResponse } from "../types/ProductResponse";

export interface ISalesService {
  getCatalog(query: GetCatalogDTO): Promise<ProductResponse[]>;
}
