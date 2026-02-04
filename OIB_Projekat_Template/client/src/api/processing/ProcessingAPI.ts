import axios,{AxiosInstance} from "axios"   ;
import { IProcessingAPI } from "./IProcessingAPI";
import { AmountDTO } from "../../models/processing/AmountDTO";
import { StartDTO } from "../../models/processing/StartDTO";




export class ProcessingAPI implements IProcessingAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

 

  async startProcessingBatch(token: string, data: StartDTO): Promise<AmountDTO> {
    const response = await this.axiosInstance.post("/processing/start", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async getProcessedAmounts(token: string): Promise<AmountDTO[]> {
    const response = await this.axiosInstance.get("/processing/batches", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
}