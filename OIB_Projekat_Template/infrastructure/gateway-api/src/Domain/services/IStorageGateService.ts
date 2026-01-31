import { SendPackagingDTO } from "../DTOs/StorageDTOs/SendPackagingDTO";

export interface IStorageGateService {
  sendPackaging(
    payload: SendPackagingDTO,
    headers: Record<string, string>
  ): Promise<void>;
}