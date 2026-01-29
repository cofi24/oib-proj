import axios, {AxiosHeaders} from "axios";
import { SummaryDTO } from "../../Domain/DTOs/AnalyticsDTOs/SummaryDTO";
import { TopTenDTO } from "../../Domain/DTOs/AnalyticsDTOs/TopTenDTO";
import { TrendDTO } from "../../Domain/DTOs/AnalyticsDTOs/TrendDTO";
import { CreateReportDTO } from "../../Domain/DTOs/AnalyticsDTOs/CreateReportDTO";
import{ IAnalyticsGateService } from "../../Domain/services/IAnalyticsGateService";
import { ReceiptDTO } from "../../Domain/DTOs/AnalyticsDTOs/ReceiptsDTO";
import { AnalyticsReportDTO } from "../../Domain/DTOs/AnalyticsDTOs/AnalyticsReportDTO";


export class AnalyticsGateService implements IAnalyticsGateService {
  private readonly baseUrl =
    process.env.ANALYTICS_SERVICE_URL ?? "http://localhost:5557/api/v1";

  private buildHeaders(token?: string): AxiosHeaders {
    const headers = new AxiosHeaders();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  async createReport(body: CreateReportDTO, token?: string): Promise<AnalyticsReportDTO> {
    const res = await axios.post<AnalyticsReportDTO>(
      `${this.baseUrl}/analytics/reports`,
      body,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getReports(token?: string): Promise<AnalyticsReportDTO[]> {
    const res = await axios.get<AnalyticsReportDTO[]>(
      `${this.baseUrl}/analytics/reports`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getReportById(id: number, token?: string): Promise<AnalyticsReportDTO> {
    const res = await axios.get<AnalyticsReportDTO>(
      `${this.baseUrl}/analytics/reports/${id}`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getSummary(period: string, token?: string): Promise<SummaryDTO> {
    const res = await axios.get<SummaryDTO>(
      `${this.baseUrl}/analytics/reports/summary/${period}`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getTrend(token?: string): Promise<TrendDTO[]> {
    const res = await axios.get<TrendDTO[]>(
      `${this.baseUrl}/analytics/reports/trend`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getTop10(token?: string): Promise<TopTenDTO[]> {
    const res = await axios.get<TopTenDTO[]>(
      `${this.baseUrl}/analytics/reports/top10`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getTop10Revenue(token?: string): Promise<TopTenDTO[]> {
    const res = await axios.get<TopTenDTO[]>(
      `${this.baseUrl}/analytics/reports/top10/revenue`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async exportPdf(id: number, token?: string): Promise<{ buffer: Buffer; filename: string }> {
    const res = await axios.get<ArrayBuffer>(
      `${this.baseUrl}/analytics/reports/${id}/pdf`,
      {
        headers: this.buildHeaders(token),
        responseType: "arraybuffer",
      }
    );

    return {
      buffer: Buffer.from(res.data),
      filename: `report-${id}.pdf`,
    };
  }

  async createReceipt(body: ReceiptDTO, token?: string): Promise<ReceiptDTO> {
    const res = await axios.post<ReceiptDTO>(
      `${this.baseUrl}/analytics/receipts`,
      body,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getReceipts(token?: string): Promise<ReceiptDTO[]> {
    const res = await axios.get<ReceiptDTO[]>(
      `${this.baseUrl}/analytics/receipts`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async getReceiptById(id: number, token?: string): Promise<ReceiptDTO> {
    const res = await axios.get<ReceiptDTO>(
      `${this.baseUrl}/analytics/receipts/${id}`,
      { headers: this.buildHeaders(token) }
    );
    return res.data;
  }

  async exportReceiptPdf(id: number, token?: string): Promise<{ buffer: Buffer; filename: string }> {
    const res = await axios.get<ArrayBuffer>(
      `${this.baseUrl}/analytics/receipts/${id}/pdf`,
      {
        headers: this.buildHeaders(token),
        responseType: "arraybuffer",
      }
    );

    return {
      buffer: Buffer.from(res.data),
      filename: `racun-${id}.pdf`,
    };
  }
}