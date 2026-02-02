import { AuditLogType } from "../enums/AuditLogType";

export interface IAuditingService{
    log(level: AuditLogType, message: string): Promise<boolean>;
}