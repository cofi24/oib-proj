import axios, { AxiosInstance } from "axios";
import { IStorageAPI } from "./IStorageAPI";
import { SendPackagingDTO } from "../../models/storage/SendPackagingDTO";

export class StorageAPI implements IStorageAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  async sendPackaging(
    token: string,
    payload: SendPackagingDTO
  ): Promise<void> {
    await this.axiosInstance.post(
      "/storage/send-packaging",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
