import axios from "axios";
import { IProcessingGateService } from "../../Domain/services/IProcessingGateService";
import { StartDTO } from "../../Domain/DTOs/ProcessingDTOs/StartDTO";
import { ProcessedDTO } from "../../Domain/DTOs/ProcessingDTOs/ProcessedDTO";

export class ProcessingGateService
  implements IProcessingGateService
{
  private readonly baseUrl: string;

  constructor() {
    if (!process.env.PROCESSING_SERVICE_API) {
      throw new Error("PROCESSING_SERVICE_API not defined");
    }

    this.baseUrl = process.env.PROCESSING_SERVICE_API + "/processing";
  }

  async start(
    data: StartDTO,
    token?: string
  ): Promise<ProcessedDTO> {
    const res = await axios.post<ProcessedDTO>(
      `${this.baseUrl}/start`,
      data,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return res.data;
  }

  async getBatches(token?: string): Promise<ProcessedDTO[]> {
    const res = await axios.get<ProcessedDTO[]>(
      `${this.baseUrl}/batches`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return res.data;
  }
}