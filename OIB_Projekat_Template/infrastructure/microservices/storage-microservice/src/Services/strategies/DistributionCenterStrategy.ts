import { IStorageStrategy } from "../../Domain/services/IStorageStrategy";

export class DistributionCenterStrategy implements IStorageStrategy {
  getName(): string {
    return "DISTRIBUTION_CENTER";
  }

  getMaxPackagingPerRequest(): number {
    return 3;
  }

  getDispatchDelayMs(): number {
    return 500; // 0.5s
  }
}
