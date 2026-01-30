import { RunSimulationDTO } from "../DTOs/Performance-analysis/RunSimulationDTO";

export interface IPerformanceGateService {
runSimulation(algorithmName: string, headers: Record<string, string>): Promise<any>;
  listPerformanceReports(headers: Record<string, string>): Promise<any[]>;
  getPerformanceReportById(id: number, headers: Record<string, string>): Promise<any>;
  getPerformanceReportPdf( id: number, headers: Record<string, string>
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }>;

}
