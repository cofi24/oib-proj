import axios from "axios";
import { IProductionGateService } from "../../Domain/services/IProductionGateService";
import { PlantDTO } from "../../Domain/DTOs/ProductionDTOs/PlantDTO";
import { PlantCreateDTO } from "../../Domain/DTOs/ProductionDTOs/PlantCreateDTO";
import { HarvestDTO } from "../../Domain/DTOs/ProductionDTOs/HarvestDTO";
import { OilDTO } from "../../Domain/DTOs/ProductionDTOs/OilDTO";
export class ProductionGateService
  implements IProductionGateService
{
  private readonly baseUrl: string;

  constructor() {
    if (!process.env.PRODUCTION_SERVICE_API) {
      throw new Error("PRODUCTION_SERVICE_API not defined");
    }

    this.baseUrl = process.env.PRODUCTION_SERVICE_API + "/production";
  }

  async getAllPlants(token?: string): Promise<PlantDTO[]> {
    const res = await axios.get<PlantDTO[]>(
      `${this.baseUrl}/plants`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return res.data;
  }

  async plant(
    data: PlantCreateDTO,
    token?: string
  ): Promise<PlantDTO> {
    const res = await axios.post<PlantDTO>(
      `${this.baseUrl}/plant`,
      data,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return res.data;
  }

  async adjustOilStrength(
    data: OilDTO,
    token?: string
  ): Promise<PlantDTO> {
    const res = await axios.post<PlantDTO>(
      `${this.baseUrl}/adjust`,
      data,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return res.data;
  }

  async harvest(
    data: HarvestDTO,
    token?: string
  ): Promise<{ harvested: number }> {
    const res = await axios.post<{ harvested: number }>(
      `${this.baseUrl}/harvest`,
      data,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    );

    return res.data;
  }
}
