import axios from 'axios';
import { AuditLogType } from '../Domain/enums/AuditLogType';
import { IAuditingService } from '../Domain/services/IAuditingService';

export class AuditingService implements IAuditingService {
    private auditUrl = process.env.AUDIT_SERVICE_URL ?? "http://localhost:5566/api/v1/audit";

    async log(level: AuditLogType, message: string): Promise<boolean> {
        try {
            await axios.post(this.auditUrl, {
                type: level,        
                description: message 
            });
            return true;
        } catch (err) {
            console.error("[AuditService] Error sending log:", err);
            return false;
        }
    }
}
