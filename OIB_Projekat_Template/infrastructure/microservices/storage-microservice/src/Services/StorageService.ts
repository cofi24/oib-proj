import { IStorageService, SendPackagingResult } from "../Domain/services/IStorageService";
import { UserRole } from "../Domain/enums/UserRole";
import { IStorageStrategy } from "../Domain/services/IStorageStrategy";
import { DistributionCenterStrategy } from "./strategies/DistributionCenterStrategy";
import { WarehouseCenterStrategy } from "./strategies/WarehouseCenterStrategy";
import { IPackagingRepository } from "../Domain/services/IPackagingRepository";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export class StorageService implements IStorageService {
  constructor(private readonly packagingRepo: IPackagingRepository) {}

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

    const maxAllowed = strategy.getMaxPackagingPerRequest();
    if (amount > maxAllowed) {
      throw new Error(`Too many packages requested. Max allowed is ${maxAllowed}.`);
    }

    // U ovom projektu (za sada) trošimo samo BOX.
    // Kasnije lako proširimo da troši više tipova (BOX/BAG/WRAP).
    await this.packagingRepo.decreasePackaging("BOX", amount);

    // Simulacija slanja radi nakon DB commit-a (ne držimo lock tokom sleep-a)
    await sleep(strategy.getDispatchDelayMs());

    return {
      shipped: amount,
      strategy: strategy.getName(),
    };
  }
}
