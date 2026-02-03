import axios from "axios";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";

export class AuditingService implements IAuditingService{
    private base = process.env.AUDIT_SERVICE_API ?? "http://localhost:5566/api/v1";
    async log(level: AuditLogType, message: string): Promise<boolean> {
        try{
            await axios.post(`${this.base}/audit`,{
                type: level,
                description: `[PRODUCTION] ${message}`,
            });
            return true;
        }catch(e){
            console.error("[PRODUCTION][Audit] Failed:", e);
            return false;
        }
    }
}