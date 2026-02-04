import axios, { AxiosInstance } from 'axios';
import { IProductionAPI } from './IProductionAPI';

export class ProductionAPI implements IProductionAPI {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL,
      headers: { "Content-Type": "application/json" },
    });
  }

  getAllPlants(token: string) {
    return this.axiosInstance.get("/production/plants", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.data);
  }

  plant(token: string, plantType: string) {
    return this.axiosInstance.post("/production/plant", { plantType }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.data);
  }

  adjust(token: string, plantId: number, percent: number) {
  return this.axiosInstance.post(
    "/production/adjust",
    { plantID: plantId, percent },
    { headers: { Authorization: `Bearer ${token}` } }
  ).then(r => r.data);
}

  harvest(token: string, plantType: string, quantity: number) {
    return this.axiosInstance.post("/production/harvest", { plantType, quantity }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.data);
  }

  balance(token: string, plantType: string, processedOilStrength: number){
    return this.axiosInstance.post("/production/production/balance",
      { plantType, processedOilStrength },
        { headers: { Authorization: `Bearer ${token}` }}
    ).then(r=>r.data);
  }
}