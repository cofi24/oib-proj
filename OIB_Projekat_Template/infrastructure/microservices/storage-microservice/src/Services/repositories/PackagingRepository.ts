import { IPackagingRepository } from "../../Domain/services/IPackagingRepository";
import { Db } from "../../Database/DbConnectionPool";
import { Packaging } from "../../Domain/models/Packaging";

export class PackagingRepository implements IPackagingRepository {
  async decreasePackaging(type: string, amount: number): Promise<void> {
    const queryRunner = Db.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Zaključavanje reda (pessimistic write) da paralelni zahtevi ne “prepišu” stanje
      const packaging = await queryRunner.manager.findOne(Packaging, {
        where: { type },
        lock: { mode: "pessimistic_write" },
      });

      if (!packaging) {
        throw new Error(`Packaging type '${type}' not found.`);
      }

      if (packaging.quantity < amount) {
        throw new Error(
          `Not enough packaging. Available=${packaging.quantity}, requested=${amount}.`
        );
      }

      packaging.quantity -= amount;
      await queryRunner.manager.save(packaging);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
