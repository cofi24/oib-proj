import { CreateAuditLogDTO } from "../../Domain/DTOs/CreateAuditLogDTO";
import { AuditLogType } from "../../Domain/enums/AuditLogType";

export function validateCreateAuditLog(
  data: CreateAuditLogDTO
): { success: boolean; message?: string } {

  if (!data) {
    return { success: false, message: "Request body is missing" };
  }
  if (!data.type) {
    return { success: false, message: "Audit log type is required" };
  }
  if (!Object.values(AuditLogType).includes(data.type)) {
    return { success: false, message: "Invalid audit log type" };
  }
  if (!data.description?.trim()) {
    return { success: false, message: "Description is required" };
  }
  if (data.description.length > 1000) {
    return { success: false, message: "Description is too long" };
  }

  return { success: true };
}
