import { AuditLogDTO } from "../../models/audit/AuditLogDTO";
import { CreateAuditLogDTO } from "../../models/audit/CreateAuditLogDTO";
import { UpdateAuditLogDTO } from "../../models/audit/UpdateAuditLogDTO";


export interface IAuditAPI {
  getAll(token: string): Promise<AuditLogDTO[]>;
  getById(token: string, id: number): Promise<AuditLogDTO>;
  create(token: string, data: CreateAuditLogDTO): Promise<AuditLogDTO>;
  update(token: string, id: number, data: UpdateAuditLogDTO): Promise<AuditLogDTO>;
  delete(token: string, id: number): Promise<void>;
}