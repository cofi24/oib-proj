import { IStorageService, SendPackagingResult } from "../Domain/services/IStorageService";
import { UserRole } from "../Domain/enums/UserRole";
import { IStorageStrategy } from "../Domain/services/IStorageStrategy";
import { DistributionCenterStrategy } from "./strategies/DistributionCenterStrategy";
import { WarehouseCenterStrategy } from "./strategies/WarehouseCenterStrategy";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export class StorageService implements IStorageService {
  private resolveStrategy(role: UserRole): IStorageStrategy {
    // Pravilo:
    // ADMIN i SALES_MANAGER -> distributivni
    // SELLER -> magacinski
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

    await sleep(strategy.getDispatchDelayMs());

    return {
      shipped: amount,
      strategy: strategy.getName(),
    };
  }
}
