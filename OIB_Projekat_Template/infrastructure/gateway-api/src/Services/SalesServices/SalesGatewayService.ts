import axios from "axios";
import { ISalesGatewayService } from "../../Domain/services/ISalesGatewayService";

export class SalesGatewayService implements ISalesGatewayService{
  private readonly baseUrl =
    process.env.SALES_SERVICE_URL ?? "http://localhost:3007/api/v1";

  async getCatalog<TResponse>(token?: string): Promise<TResponse> {
    const res = await axios.get<TResponse>(`${this.baseUrl}/sales/catalog`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }

  async checkout<TRequest, TResponse>(
    body: TRequest,
    token?: string,
    userRole?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(`${this.baseUrl}/sales/checkout`, body, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(userRole && { "x-user-role": userRole }),
      },
    });

    return res.data;
  }

  async health<TResponse>(): Promise<TResponse> {
    const res = await axios.get<TResponse>(`${this.baseUrl}/sales/health`);
    return res.data;
  }
}