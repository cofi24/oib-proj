import { SendPackagingDTO } from "../../models/storage/SendPackagingDTO";

export interface IStorageAPI {
  sendPackaging(
    token: string,
    payload: SendPackagingDTO
  ): Promise<void>;
}