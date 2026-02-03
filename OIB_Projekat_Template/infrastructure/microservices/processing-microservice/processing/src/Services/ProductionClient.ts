import axios from "axios";
import { IProductionClient } from "../Domain/services/IProductionClient";

export class ProductionClient implements IProductionClient {
  private base = process.env.PRODUCTION_SERVICE_API ?? "http://localhost:5560/api/v1/production";

  async harvest(plantType: string, quantity: number, token?: string): Promise<{ harvested: number }> {
    const res = await axios.post(
      `${this.base}/harvest`,
      { plantType, quantity },
      { headers: token ? { Authorization: `Bearer ${token}` }:{} }
    );
    return res.data;
  }

  async plantAndAdjust(
  plantType: string,
  processedOilStrength: number,
  token?: string
) {
  const res = await axios.post(
    `${this.base}/balance`,
    { plantType, processedOilStrength },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
}

}
