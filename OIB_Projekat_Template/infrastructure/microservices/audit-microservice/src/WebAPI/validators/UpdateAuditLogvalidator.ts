import { UpdateAuditLogDTO } from "../../Domain/DTOs/UpdateAuditLogDTO";
import { AuditLogType } from "../../Domain/enums/AuditLogType";

export function validateUpdateAuditLog(
  data: UpdateAuditLogDTO
): { success: boolean; message?: string } {

  if (!data || Object.keys(data).length === 0) {
    return { success: false, message: "At least one field must be provided for update" };
  }
  if (data.type !== undefined) {
    if (!Object.values(AuditLogType).includes(data.type)) {
      return { success: false, message: "Invalid audit log type" };
    }
  }
  if (data.description !== undefined) {
    if (!data.description.trim()) {
      return { success: false, message: "Description cannot be empty" };
    }
    if (data.description.length > 1000) {
      return { success: false, message: "Description is too long" };
    }
  }

  return { success: true };
}
