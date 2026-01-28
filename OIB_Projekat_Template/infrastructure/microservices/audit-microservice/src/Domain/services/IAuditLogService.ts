import { CreateAuditLogDTO } from "../DTOs/CreateAuditLogDTO";
import { UpdateAuditLogDTO } from "../DTOs/UpdateAuditLogDTO";
import { AuditLogDTO } from "../DTOs/AuditLogDTO";

export interface IAuditLogService {
    getAll(): Promise<AuditLogDTO[]>;
    getById(id: number): Promise<AuditLogDTO>;
    create(data: CreateAuditLogDTO): Promise<AuditLogDTO>;
    update(id: number, data: UpdateAuditLogDTO): Promise<AuditLogDTO>;
    delete(id: number): Promise<void>;
}