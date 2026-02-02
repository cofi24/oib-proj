import { AuditLogType } from "../../enums/AuditLogType";

export interface AuditLogDTO {
  id: number;
  type: AuditLogType;
  description: string;
  createdAt: string; 
}


