import { IStorageService, SendPackagingResult } from "../Domain/services/IStorageService";
import { UserRole } from "../Domain/enums/UserRole";
import { IStorageStrategy } from "../Domain/services/IStorageStrategy";
import { DistributionCenterStrategy } from "./strategies/DistributionCenterStrategy";
import { WarehouseCenterStrategy } from "./strategies/WarehouseCenterStrategy";
import { IPackagingRepository } from "../Domain/services/IPackagingRepository";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { AuditingService } from "./AuditingService";


function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export class StorageService implements IStorageService {
  constructor(
    private readonly packagingRepo: IPackagingRepository,
    private readonly auditingService: IAuditingService
  ) {}

  private resolveStrategy(role: UserRole): IStorageStrategy {
    if (role === UserRole.ADMIN || role === UserRole.SALES_MANAGER) {
      return new DistributionCenterStrategy();
    }
    return new WarehouseCenterStrategy();
  }

  async sendPackaging(role: UserRole, amount: number): Promise<SendPackagingResult> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Amount must be a positive number.");
    }
    
    const strategy = this.resolveStrategy(role);
    const batchSize = strategy.getMaxPackagingPerRequest();
    const delayMs = strategy.getDispatchDelayMs();

    let remaining = amount;
    let totalShipped = 0;
    const batches: number[] = [];

    // Pošalji u više batch-eva ako je potrebno
    while (remaining > 0) {
      const toShip = Math.min(remaining, batchSize);
      
      // Smanji zalihe u bazi
      await this.packagingRepo.decreasePackaging("BOX", toShip);
      
      // Simuliraj slanje (delay)
      await sleep(delayMs);
      
      totalShipped += toShip;
      remaining -= toShip;
      batches.push(toShip);

      await this.auditingService.log(
        AuditLogType.INFO,
        `[STORAGE] Batch sent | strategy=${strategy.getName()} | shipped=${toShip} | remaining=${remaining}`
      );
    }

    await this.auditingService.log(
      AuditLogType.INFO,
      `[STORAGE] All packaging sent | strategy=${strategy.getName()} | total=${totalShipped} | batches=${batches.length}`
    );

    return {
      shipped: totalShipped,
      strategy: strategy.getName(),
      batches: batches, // Koliko je poslato u svakom batch-u
      totalBatches: batches.length,
      totalTimeMs: batches.length * delayMs
    };
  }
}