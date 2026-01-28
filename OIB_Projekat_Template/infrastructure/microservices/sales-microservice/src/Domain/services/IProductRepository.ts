import { GetCatalogDTO } from "../DTOs/GetCatalogDTO";
import { Product } from "../models/Product";
import { BuyItemDTO } from "../DTOs/BuyRequestDTO";


export interface IProductRepository {
  getCatalog(query: GetCatalogDTO): Promise<Product[]>;
  reserveProducts(items: BuyItemDTO[]): Promise<Product[]>;
  restoreProducts(items: BuyItemDTO[]): Promise<void>;

}
