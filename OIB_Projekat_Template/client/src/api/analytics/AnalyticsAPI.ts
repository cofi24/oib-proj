import axios from "axios";
import { IAnalyticsAPI } from "./IAnalyticsAPI";
import { TopDTO } from "../../models/analytics/TopDTO";
import { TrendDTO } from "../../models/analytics/TrendDTO";
import { SummaryDTO } from "../../models/analytics/SummaryDTO";
import { ReceiptDTO } from "../../models/analytics/ReceiptDTO";
import { ReportDTO } from "../../models/analytics/ReportDTO";
import { SalesPeriod } from "../../models/analytics/SummaryDTO";


export class AnalyticsAPI implements IAnalyticsAPI {
  private readonly baseUrl =
    import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:4000/api/v1";

  private auth(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  async getReports(token: string): Promise<ReportDTO[]> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async getReportById(token: string, id: number): Promise<ReportDTO> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports/${id}`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async createReport(
    token: string,
    data: {
      nazivIzvestaja: string;
      opis: string;
      period: SalesPeriod;
      ukupnaProdaja: number;
      ukupnaZarada: number;
    }
  ): Promise<ReportDTO> {
    const res = await axios.post(`${this.baseUrl}/analytics/reports`, data, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async exportReportPdf(token: string, id: number): Promise<Blob> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports/${id}/pdf`, {
      headers: this.auth(token),
      responseType: "blob",
    });
    return res.data;
  }

  async getSummary(token: string, period: SalesPeriod): Promise<SummaryDTO> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports/summary/${period}`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async getTrend(token: string, period?: SalesPeriod): Promise<TrendDTO[]> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports/trend`, {
      headers: this.auth(token),
      params: { period },
    });
    return res.data;
  }

  async getTop10(token: string): Promise<TopDTO[]> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports/top10`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async getTop10Revenue(token: string): Promise<{ ukupno: number }> {
    const res = await axios.get(`${this.baseUrl}/analytics/reports/top10/revenue`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async getReceipts(token: string): Promise<ReceiptDTO[]> {
    const res = await axios.get(`${this.baseUrl}/analytics/receipts`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async getReceiptById(token: string, id: number): Promise<ReceiptDTO> {
    const res = await axios.get(`${this.baseUrl}/analytics/receipts/${id}`, {
      headers: this.auth(token),
    });
    return res.data;
  }

  async exportReceiptPdf(token: string, id: number): Promise<Blob> {
    const res = await axios.get(`${this.baseUrl}/analytics/receipts/${id}/pdf`, {
      headers: this.auth(token),
      responseType: "blob",
    });
    return res.data;
  }
}
