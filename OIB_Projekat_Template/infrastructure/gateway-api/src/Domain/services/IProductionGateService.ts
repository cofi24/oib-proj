import { PlantDTO } from "../DTOs/ProductionDTOs/PlantDTO";
import { PlantCreateDTO } from "../DTOs/ProductionDTOs/PlantCreateDTO";
import { HarvestDTO } from "../DTOs/ProductionDTOs/HarvestDTO";
import { OilDTO } from "../DTOs/ProductionDTOs/OilDTO";

export interface IProductionGateService {
  // Plants
  getAllPlants(token?: string): Promise<PlantDTO[]>;
 plant( data: PlantCreateDTO, token?: string ): Promise<PlantDTO>;
 adjustOilStrength(data: OilDTO,token?: string): Promise<PlantDTO>;
  harvest( data: HarvestDTO,token?: string): Promise<{ harvested: number }>;
}