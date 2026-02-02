import { AuditLogType } from "../enums/AuditLogType";

export interface UpdateAuditLogDTO {
    type?: AuditLogType;
    description?: string;
}