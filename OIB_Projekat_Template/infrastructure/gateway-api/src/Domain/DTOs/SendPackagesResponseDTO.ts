import { PackageDTO } from "./PackageDTO";

export interface SendPackagesResponseDTO {
    success: boolean;
    sentPackages: PackageDTO[];
    totalSent: number;
}