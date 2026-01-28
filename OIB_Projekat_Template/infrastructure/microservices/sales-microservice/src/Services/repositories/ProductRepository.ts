import { ILike } from "typeorm";
import { Db } from "../../Database/DbConnectionPool";
import { GetCatalogDTO } from "../../Domain/DTOs/GetCatalogDTO";
import { Product } from "../../Domain/models/Product";
import { IProductRepository } from "../../Domain/services/IProductRepository";

export class ProductRepository implements IProductRepository {
  async getCatalog(query: GetCatalogDTO): Promise<Product[]> {
    const repo = Db.getRepository(Product);

    const where =
      query.search && query.search.trim().length > 0
        ? [
            { name: ILike(`%${query.search.trim()}%`) },
            { brand: ILike(`%${query.search.trim()}%`) },
          ]
        : undefined;

    const sortBy = query.sortBy ?? "name";
    const sortOrder = (query.sortOrder ?? "asc").toUpperCase() as "ASC" | "DESC";

    return repo.find({
      where,
      order: { [sortBy]: sortOrder } as any,
    });
  }
}
