import { ILike } from "typeorm";
import { Db } from "../../Database/DbConnectionPool";
import { GetCatalogDTO } from "../../Domain/DTOs/GetCatalogDTO";
import { Product } from "../../Domain/models/Product";
import { IProductRepository } from "../../Domain/services/IProductRepository";
import { BuyItemDTO } from "../../Domain/DTOs/BuyRequestDTO";


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

    async reserveProducts(items: BuyItemDTO[]): Promise<Product[]> {
    if (!items || items.length === 0) {
      throw new Error("No items provided.");
    }

    // Validacija: nema duplih productId (lakše i sigurnije)
    const ids = items.map((i) => i.productId);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new Error("Duplicate productId in items is not allowed.");
    }

    const queryRunner = Db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reserved: Product[] = [];

      for (const item of items) {
        if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
          throw new Error("Quantity must be a positive number.");
        }

        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
          lock: { mode: "pessimistic_write" },
        });

        if (!product) {
          throw new Error(`Product with id=${item.productId} not found.`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(
            `Not enough stock for product id=${item.productId}. Available=${product.quantity}, requested=${item.quantity}.`
          );
        }

        product.quantity -= item.quantity;
        await queryRunner.manager.save(product);

        reserved.push(product);
      }

      await queryRunner.commitTransaction();
      return reserved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

    async restoreProducts(items: BuyItemDTO[]): Promise<void> {
    if (!items || items.length === 0) return;

    const queryRunner = Db.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of items) {
        // restore treba da bude "best-effort", ali nećemo dozvoliti negativne količine itd.
        if (!Number.isFinite(item.quantity) || item.quantity <= 0) continue;

        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
          lock: { mode: "pessimistic_write" },
        });

        // Ako proizvod ne postoji, preskoči (ne rušimo rollback)
        if (!product) continue;

        product.quantity += item.quantity;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // rollback rollback-a ne bacamo napolje da ne maskiramo originalnu grešku
      console.error("[restoreProducts] failed:", err);
    } finally {
      await queryRunner.release();
    }
  }


}
