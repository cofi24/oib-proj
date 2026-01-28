import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";

export class ConsoleAuditingService implements IAuditingService {
    async log(level: AuditLogType, message: string): Promise<boolean> {
        try {
            const timestamp = new Date().toISOString();
            const formatted = `[${timestamp}] [${level}] ${message}`;
            switch (level) {
                case AuditLogType.ERROR:
                    console.error(formatted);
                    break;
                case AuditLogType.WARNING:
                    console.warn(formatted);
                    break;
                case AuditLogType.INFO:
                    console.info(formatted);
                    break;
                default:
                    console.log(formatted);
            }
            return true;
        } catch {
            return false;
        }
    }
}