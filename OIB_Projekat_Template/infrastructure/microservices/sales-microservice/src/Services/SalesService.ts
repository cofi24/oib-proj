import { ISalesService } from "../Domain/services/ISalesService";
import { GetCatalogDTO } from "../Domain/DTOs/GetCatalogDTO";
import { ProductResponse } from "../Domain/types/ProductResponse";
import { IProductRepository } from "../Domain/services/IProductRepository";

export class SalesService implements ISalesService {
  constructor(private readonly productRepo: IProductRepository) {}

  async getCatalog(query: GetCatalogDTO): Promise<ProductResponse[]> {
    const products = await this.productRepo.getCatalog(query);

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: Number(p.price),
      quantity: p.quantity,
    }));
  }
}
