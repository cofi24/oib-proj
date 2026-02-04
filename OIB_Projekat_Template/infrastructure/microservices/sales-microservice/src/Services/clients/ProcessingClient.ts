import axios, { AxiosInstance } from "axios";

export class ProcessingClient {
  private client: AxiosInstance;

  constructor() {
    const base = process.env.PROCESSING_SERVICE_API;
    this.client = axios.create({
      baseURL: `${base}`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
  }

  async getCatalogg(headers: Record<string, string>): Promise<any[]> {
    const resp = await this.client.get("/processing/batches", { headers });
    return resp.data;
  }
}