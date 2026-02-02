import type  { PerformanceRepoDTO } from "./PerformanceRepoDTO";


export function mapPerformanceReport(raw: any): PerformanceRepoDTO {
  return {
    id: Number(raw.id),
    algorithmName: String(raw.algorithmName ?? ""),

    executionTime: Number(raw.executionTime ?? 0),
    successRate: Number(raw.successRate ?? 0),
    resourceUsage: Number(raw.resourceUsage ?? 0),

    summary: String(raw.summary ?? ""),
    createdAt: String(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
  };
}
