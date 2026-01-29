import { IStorageStrategy } from "../../Domain/services/IStorageStrategy";

export class WarehouseCenterStrategy implements IStorageStrategy {
  getName(): string {
    return "WAREHOUSE_CENTER";
  }

  getMaxPackagingPerRequest(): number {
    return 1;
  }

  getDispatchDelayMs(): number {
    return 2500; // 2.5s
  }
}
