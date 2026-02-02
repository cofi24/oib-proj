import axios from "axios";
import { IStorageGatewayService } from "../../Domain/services/IStorageGatewayService";
import { WarehouseDTO } from "../../Domain/DTOs/WarehouseDTO";
import { CreateWarehouseDTO } from "../../Domain/DTOs/CreateWarehouseDTO";
import { UpdateWarehouseDTO } from "../../Domain/DTOs/UpdateWarehouseDTO";
import { PackageDTO } from "../../Domain/DTOs/PackageDTO";
import { CreatePackageDTO } from "../../Domain/DTOs/CreatePackageDTO";
import { UpdatePackageDTO } from "../../Domain/DTOs/UpdatePackageDTO";
import { SendPackagesRequestDTO } from "../../Domain/DTOs/SendPackagesRequestDTO";
import { SendPackagesResponseDTO } from "../../Domain/DTOs/SendPackagesResponseDTO";
import { StorageInfoDTO } from "../../Domain/DTOs/StorageInfoDTO";
import { WarehouseCapacityDTO } from "../../Domain/DTOs/WarehouseCapacityDTO";

export class StorageGatewayService implements IStorageGatewayService {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = process.env.STORAGE_SERVICE_API!;
        console.log("Storage Service Base URL:", this.baseUrl);

        if (!this.baseUrl || this.baseUrl === "undefined") {
            throw new Error("STORAGE_SERVICE_API is not defined in .env");
        }
    }


    async getAllWarehouses(token?: string): Promise<WarehouseDTO[]> {
        const res = await axios.get(`${this.baseUrl}/warehouses`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async getWarehouseById(id: number, token?: string): Promise<WarehouseDTO> {
        const res = await axios.get(`${this.baseUrl}/warehouses/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async createWarehouse(data: CreateWarehouseDTO, token?: string): Promise<WarehouseDTO> {
        const res = await axios.post(`${this.baseUrl}/warehouses`, data, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async updateWarehouse(id: number, data: UpdateWarehouseDTO, token?: string): Promise<WarehouseDTO> {
        const res = await axios.put(`${this.baseUrl}/warehouses/${id}`, data, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async deleteWarehouse(id: number, token?: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/warehouses/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    async getWarehouseCapacity(id: number, token?: string): Promise<WarehouseCapacityDTO> {
        const res = await axios.get(`${this.baseUrl}/warehouses/${id}/capacity`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }


    async getAllPackages(token?: string): Promise<PackageDTO[]> {
        const res = await axios.get(`${this.baseUrl}/packages`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async getPackageById(id: number, token?: string): Promise<PackageDTO> {
        const res = await axios.get(`${this.baseUrl}/packages/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async createPackage(data: CreatePackageDTO, token?: string): Promise<PackageDTO> {
        const res = await axios.post(`${this.baseUrl}/packages`, data, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async updatePackage(id: number, data: UpdatePackageDTO, token?: string): Promise<PackageDTO> {
        const res = await axios.put(`${this.baseUrl}/packages/${id}`, data, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async deletePackage(id: number, token?: string): Promise<void> {
        await axios.delete(`${this.baseUrl}/packages/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    }

    async getPackagesByStatus(status: string, token?: string): Promise<PackageDTO[]> {
        const res = await axios.get(`${this.baseUrl}/packages/status/${status}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }

    async getPackagesByWarehouse(warehouseId: number, token?: string): Promise<PackageDTO[]> {
        const res = await axios.get(`${this.baseUrl}/packages/warehouse/${warehouseId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }


    async sendPackages(data: SendPackagesRequestDTO, token?: string, userRole?: string): Promise<SendPackagesResponseDTO> {
    const res = await axios.post(`${this.baseUrl}/storage/send`, data, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { 'X-User-Role': userRole } : {})
        }
    });
    return res.data;
}

    async getStorageInfo(token?: string, userRole?: string): Promise<StorageInfoDTO> {
    const res = await axios.get(`${this.baseUrl}/storage/info`, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userRole ? { 'X-User-Role': userRole } : {})
        }
    });
    return res.data;
}
}