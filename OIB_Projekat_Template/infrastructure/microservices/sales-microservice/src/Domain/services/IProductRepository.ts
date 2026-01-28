import { GetCatalogDTO } from "../DTOs/GetCatalogDTO";
import { Product } from "../models/Product";

export interface IProductRepository {
  getCatalog(query: GetCatalogDTO): Promise<Product[]>;
}
