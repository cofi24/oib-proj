import { StartProcessingDTO } from "../../Domain/DTOs/StartProcessingDTO";

export function validateStartProcessing(data: StartProcessingDTO) {
  if (!data) return { success: false, message: "Body missing" };

  if (!data.perfumeType?.trim()) return { success: false, message: "perfumeType is required" };

  if (!Number.isInteger(data.bottleCount) || data.bottleCount <= 0)
    return { success: false, message: "bottleCount must be positive integer" };

  if (data.bottleVolumeMl !== 150 && data.bottleVolumeMl !== 250)
    return { success: false, message: "bottleVolumeMl must be 150 or 250" };

  return { success: true };
}
