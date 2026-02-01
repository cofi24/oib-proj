import axios,{AxiosInstance } from 'axios';
import { CreateAuditLogDTO } from '../../models/audit/CreateAuditLogDTO';
import { UpdateAuditLogDTO } from '../../models/audit/UpdateAuditLogDTO';
import { AuditLogDTO } from '../../models/audit/AuditLogDTO';
import { IAuditAPI } from './IAuditAPI';


export class AuditAPI implements IAuditAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  async getAll(token: string): Promise<AuditLogDTO[]> {
    return (
      await this.axiosInstance.get("/audit", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }

  async getById(token: string, id: number): Promise<AuditLogDTO> {
    return (
      await this.axiosInstance.get(`/audit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }

  async create(token: string, data: CreateAuditLogDTO): Promise<AuditLogDTO> {
    return (
      await this.axiosInstance.post("/audit", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }

  async update(token: string, id: number, data: UpdateAuditLogDTO): Promise<AuditLogDTO> {
    return (
      await this.axiosInstance.put(`/audit/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).data;
  }

  async delete(token: string, id: number): Promise<void> {
    await this.axiosInstance.delete(`/audit/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}