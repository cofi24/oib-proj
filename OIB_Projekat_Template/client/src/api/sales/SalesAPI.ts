import axios,{AxiosInstance} from 'axios';
import { GetCatalogDTO } from '../../models/sales/GetCatalogDTO';
import { BuyRequestDTO } from '../../models/sales/BuyRequestDTO';
import { ReceiptResponse } from '../../types/ReceiptResponse';
import { ProductResponse } from '../../types/ProductRespones';

import { ISalesAPI } from './ISalesAPI';

export class SalesAPI implements ISalesAPI  {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

 async getCatalog(
    token: string,
    query: GetCatalogDTO
  ): Promise<ProductResponse[]> {
    return this.axiosInstance.get("/sales/catalog", {
      params: query,
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.data);
  }

 async buy(
    token: string,
    payload: BuyRequestDTO
  ): Promise<ReceiptResponse> {
    return this.axiosInstance.post(
      "/sales/buy",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(r => r.data);
  }
}