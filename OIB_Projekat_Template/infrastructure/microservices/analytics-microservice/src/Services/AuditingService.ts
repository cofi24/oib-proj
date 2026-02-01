import axios from "axios";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";

export class AuditingService implements IAuditingService {

  private readonly auditUrl =
    process.env.AUDIT_SERVICE_URL ?? "http://localhost:5566/api/v1/audit";

  async log(level: AuditLogType, message: string): Promise<boolean> {
    try {
      await axios.post(this.auditUrl, {
        type: level,
        description: message
      });
      return true;
    } catch (err) {
      console.error("[AuditService] Failed:", err);
      return false;
    }
  }
}