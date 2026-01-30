import axios, { AxiosInstance, AxiosHeaders,AxiosError } from "axios";
import { RunSimulationDTO } from "../../Domain/DTOs/Performance-analysis/RunSimulationDTO";
import { IPerformanceGateService } from "../../Domain/services/IPerformanceGateService";
import dotenv from "dotenv";
dotenv.config( );

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function handleAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<any>;
    const status = ax.response?.status ?? 500;
    const message =
      ax.response?.data?.message ||
      ax.response?.data?.error ||
      ax.message ||
      "Performance service request failed";

    const e = new Error(message);
    (e as any).status = status;
    (e as any).details = ax.response?.data;
    throw e;
  }

  throw err instanceof Error ? err : new Error("Unknown error");
}

export class PerformanceGateService implements IPerformanceGateService {
    private performanceClient: AxiosInstance;

    
    
    constructor() {
      const PERFORMANCE_ANALYSIS_SERVICE_API = normalizeUrl(process.env.PERFORMANCE_ANALYSIS_SERVICE_API);

      if (!PERFORMANCE_ANALYSIS_SERVICE_API) {
        throw new Error("PERFORMANCE_URL not configured");
     }

    this.performanceClient = axios.create({
      baseURL: `${PERFORMANCE_ANALYSIS_SERVICE_API}/performance`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
  }

    
    
    
    
   async runSimulation(algorithmName: string, headers: Record<string, string>): Promise<any> {
    if (!this.performanceClient) throw new Error("PERFORMANCE_URL not configured");
    try {
      const resp = await this.performanceClient.post("/simulate", { algorithmName }, { headers });
      return resp.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async listPerformanceReports(headers: Record<string, string>): Promise<any[]> {
    if (!this.performanceClient) throw new Error("PERFORMANCE_URL not configured");
    try {
      const resp = await this.performanceClient.get("/reports", { headers });
      return resp.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async getPerformanceReportById(id: number, headers: Record<string, string>): Promise<any> {
    if (!this.performanceClient) throw new Error("PERFORMANCE_URL not configured");
    try {
      const resp = await this.performanceClient.get(`/reports/${id}`, { headers });
      return resp.data;
    } catch (err) {
      handleAxiosError(err);
    }
  }

  async getPerformanceReportPdf(
    id: number,
    headers: Record<string, string>
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    if (!this.performanceClient) throw new Error("PERFORMANCE_URL not configured");
    try {
      const resp = await this.performanceClient.get(`/reports/${id}/pdf`, {
        headers,
        responseType: "arraybuffer",
      });

      const contentType = (resp.headers["content-type"] as string) || "application/pdf";
      const cd = (resp.headers["content-disposition"] as string) || "";
      const match = /filename="?([^"]+)"?/i.exec(cd);
      const filename = match?.[1] || `performance-report-${id}.pdf`;

      return { buffer: Buffer.from(resp.data), contentType, filename };
    } catch (err) {
      handleAxiosError(err);
    }
  }

      
}

