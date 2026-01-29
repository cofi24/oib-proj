export interface IStorageStrategy {
  getName(): string;
  getMaxPackagingPerRequest(): number;
  getDispatchDelayMs(): number;
}
