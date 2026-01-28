import { UserRole } from "../enums/UserRole";

export type SendPackagingResult = {
  shipped: number;
  strategy: string;
};

export interface IStorageService {
  sendPackaging(role: UserRole, amount: number): Promise<SendPackagingResult>;
}
