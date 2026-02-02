import axios from "axios";
import { IProcessingGatewayService } from "../../Domain/services/IProcessingGatewayService";
export class ProcessingGatewayService implements IProcessingGatewayService{
  private readonly baseUrl =
    (process.env.PROCESSING_SERVICE_API ?? "") + "/processing";

  async start<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse> {
    const res = await axios.post<TResponse>(`${this.baseUrl}/start`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }

  async getBatches<TResponse>(token?: string): Promise<TResponse> {
    const res = await axios.get<TResponse>(`${this.baseUrl}/batches`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  }
}