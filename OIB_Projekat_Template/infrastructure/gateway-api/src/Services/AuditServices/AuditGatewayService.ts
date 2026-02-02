import axios from "axios";
import { IAuditGatewayService } from "../../Domain/services/IAuditGatewayService";
import { AuditLogDTO } from "../../Domain/DTOs/AuditDTOs/AuditDTO";
import { CreateAuditLogDTO } from "../../Domain/DTOs/AuditDTOs/CreateAuditLogDTO";
import { UpdateAuditLogDTO } from "../../Domain/DTOs/AuditDTOs/UpdateAuditLogDTO";

export class AuditGatewayService implements IAuditGatewayService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.AUDIT_SERVICE_API + "/audit";
    console.log("Audit Service Base URL:", this.baseUrl);
    
    if (!this.baseUrl || this.baseUrl === "undefined/audit") {
      throw new Error("AUDIT_SERVICE_API is not defined in .env");
    }
  }

  async getAll(token?: string): Promise<AuditLogDTO[]> {
    const res = await axios.get(this.baseUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data;
  }

  async getById(id: number, token?: string): Promise<AuditLogDTO> {
    const res = await axios.get(`${this.baseUrl}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data;
  }

  async create(data: CreateAuditLogDTO, token?: string): Promise<AuditLogDTO> {
    const res = await axios.post(this.baseUrl, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data;
  }

  async update(id: number, data: UpdateAuditLogDTO, token?: string): Promise<AuditLogDTO> {
    const res = await axios.put(`${this.baseUrl}/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data;
  }

  async delete(id: number, token?: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
}