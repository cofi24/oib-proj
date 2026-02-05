import { UserRole } from "../enums/UserRole";

export interface SendPackagingResult {
  shipped: number;
  strategy: string;
  batches?: number[];      // Novi
  totalBatches?: number;   // Novi
  totalTimeMs?: number;    // Novi
}

export interface IStorageService {
  sendPackaging(role: UserRole, amount: number): Promise<SendPackagingResult>;
}
