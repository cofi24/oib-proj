import { AuditLogDTO } from "../DTOs/AuditDTOs/AuditDTO";
import { CreateAuditLogDTO } from "../DTOs/AuditDTOs/CreateAuditLogDTO";
import { UpdateAuditLogDTO } from "../DTOs/AuditDTOs/UpdateAuditLogDTO";

export interface IAuditGatewayService {
  getAll(token?: string): Promise<AuditLogDTO[]>;
  getById(id: number, token?: string): Promise<AuditLogDTO>;
  create(data: CreateAuditLogDTO, token?: string): Promise<AuditLogDTO>;
  update(id: number, data: UpdateAuditLogDTO, token?: string): Promise<AuditLogDTO>;
  delete(id: number, token?: string): Promise<void>;
}