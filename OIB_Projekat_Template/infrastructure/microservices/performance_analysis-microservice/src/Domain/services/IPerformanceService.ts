import { PerformanceReport } from "../models/PerformanceReport";

export interface IPerformanceService {
    runSimulation(algorithmName: string): Promise<PerformanceReport>;
    getAllReports(): Promise<PerformanceReport[]>;
    getReportById(id: number): Promise<PerformanceReport | null>;
}
