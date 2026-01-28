export interface IPackagingRepository {
  decreasePackaging(type: string, amount: number): Promise<void>;
}
