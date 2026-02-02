import axios, { AxiosHeaders, AxiosRequestHeaders } from "axios";
import { IPerformanceGatewayService } from "../../Domain/services/IPerformanceGatewayService";

export class PerformanceGatewayService implements IPerformanceGatewayService{
  private readonly baseUrl =
    process.env.PERFORMANCE_SERVICE_API ?? "http://localhost:3009/api/v1";

  private buildHeaders(token?: string): AxiosHeaders {
    const headers = new AxiosHeaders();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  async simulate<TRequest, TResponse>(
    body: TRequest,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(
      `${this.baseUrl}/performance/simulate`,
      body,
      { headers: this.buildHeaders(token) }
    );

    return res.data;
  }

  async createReport<TRequest, TResponse>(
    body: TRequest,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(
      `${this.baseUrl}/performance/reports`,
      body,
      { headers: this.buildHeaders(token) }
    );

    return res.data;
  }

  async getReports<TResponse>(token?: string): Promise<TResponse> {
    const res = await axios.get<TResponse>(
      `${this.baseUrl}/performance/reports`,
      { headers: this.buildHeaders(token) }
    );

    return res.data;
  }

  async getReportById<TResponse>(
    id: number,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.get<TResponse>(
      `${this.baseUrl}/performance/reports/${id}`,
      { headers: this.buildHeaders(token) }
    );

    return res.data;
  }

  async exportPdf(
    id: number,
    token?: string
  ): Promise<{ buffer: Buffer; filename: string }> {
    const res = await axios.get<ArrayBuffer>(
      `${this.baseUrl}/performance/reports/${id}/pdf`,
      {
        headers: this.buildHeaders(token),
        responseType: "arraybuffer",
      }
    );

    const filename = `performance-report-${id}.pdf`;
    return { buffer: Buffer.from(res.data), filename };
  }

  async health<TResponse>(): Promise<TResponse> {
    const host = this.baseUrl.replace(/\/api\/v1\/?$/, "");
    const res = await axios.get<TResponse>(`${host}/health`);
    return res.data;
  }
}
