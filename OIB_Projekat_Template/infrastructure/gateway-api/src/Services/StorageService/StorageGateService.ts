import axios,{AxiosError, AxiosInstance} from 'axios';
import { IStorageGateService } from '../../Domain/services/IStorageGateService';
import { SendPackagingDTO } from '../../Domain/DTOs/StorageDTOs/SendPackagingDTO';

function normalizeUrl(url?: string) {
  if (!url) return undefined;
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function handleAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<any>;
    const status = ax.response?.status ?? 500;
    const message =
      ax.response?.data?.message ||
      ax.response?.data?.error ||
      ax.message ||
      "Storage service request failed";

    const e = new Error(message);
    (e as any).status = status;
    throw e;
  }
  throw err instanceof Error ? err : new Error("Unknown error");
}

export class StorageGateService implements IStorageGateService {
  private client: AxiosInstance;

  constructor() {
    const base = normalizeUrl(process.env.STORAGE_SERVICE_API);
    if (!base) throw new Error("STORAGE_SERVICE_API not configured");

    this.client = axios.create({
      baseURL: `${base}/storage`,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
  }

  async sendPackaging(
    payload: SendPackagingDTO,
    headers: Record<string, string>
  ): Promise<void> {
    try {
      await this.client.post("/send-packaging", payload, { headers });
    } catch (err) {
      handleAxiosError(err);
    }
  }
}