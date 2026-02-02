import { WarehouseDTO } from "../DTOs/WarehouseDTO";
import { CreateWarehouseDTO } from "../DTOs/CreateWarehouseDTO";
import { UpdateWarehouseDTO } from "../DTOs/UpdateWarehouseDTO";
import { PackageDTO } from "../DTOs/PackageDTO";
import { CreatePackageDTO } from "../DTOs/CreatePackageDTO";
import { UpdatePackageDTO } from "../DTOs/UpdatePackageDTO";
import { SendPackagesRequestDTO } from "../DTOs/SendPackagesRequestDTO";
import { SendPackagesResponseDTO } from "../DTOs/SendPackagesResponseDTO";
import { StorageInfoDTO } from "../DTOs/StorageInfoDTO";
import { WarehouseCapacityDTO } from "../DTOs/WarehouseCapacityDTO";

export interface IStorageGatewayService {
    getAllWarehouses(token?: string): Promise<WarehouseDTO[]>;
    getWarehouseById(id: number, token?: string): Promise<WarehouseDTO>;
    createWarehouse(data: CreateWarehouseDTO, token?: string): Promise<WarehouseDTO>;
    updateWarehouse(id: number, data: UpdateWarehouseDTO, token?: string): Promise<WarehouseDTO>;
    deleteWarehouse(id: number, token?: string): Promise<void>;
    getWarehouseCapacity(id: number, token?: string): Promise<WarehouseCapacityDTO>;
    getAllPackages(token?: string): Promise<PackageDTO[]>;
    getPackageById(id: number, token?: string): Promise<PackageDTO>;
    createPackage(data: CreatePackageDTO, token?: string): Promise<PackageDTO>;
    updatePackage(id: number, data: UpdatePackageDTO, token?: string): Promise<PackageDTO>;
    deletePackage(id: number, token?: string): Promise<void>;
    getPackagesByStatus(status: string, token?: string): Promise<PackageDTO[]>;
    getPackagesByWarehouse(warehouseId: number, token?: string): Promise<PackageDTO[]>;
    sendPackages(data: SendPackagesRequestDTO, token?: string, userRole?: string): Promise<SendPackagesResponseDTO>;
    getStorageInfo(token?: string, userRole?: string): Promise<StorageInfoDTO>;
}