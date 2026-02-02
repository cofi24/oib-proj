import axios from "axios";
import { IProductionGatewayService } from "../../Domain/services/IProductionGatewayService";

export class ProductionGatewayService implements IProductionGatewayService{
  private readonly baseUrl: string;

  constructor() {
    if (!process.env.PRODUCTION_SERVICE_API) {
      throw new Error("PRODUCTION_SERVICE_API not defined");
    }

    this.baseUrl = process.env.PRODUCTION_SERVICE_API + "/production";
  }

  async getAllPlants<TResponse>(token?: string): Promise<TResponse> {
    const res = await axios.get<TResponse>(`${this.baseUrl}/plants`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }

  async plant<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(`${this.baseUrl}/plant`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }

  async adjust<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(`${this.baseUrl}/adjust`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }

  async harvest<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(`${this.baseUrl}/harvest`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }
}
