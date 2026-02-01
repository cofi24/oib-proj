import { AdjustOilStrengthDTO } from "../DTOs/AdjustOilStrengthDTO";
import { HarvestDTO } from "../DTOs/HarvestDTO";
import { PlantCreateDTO } from "../DTOs/PlantCreateDTO";
import { PlantDTO } from "../DTOs/PlantDTO";

export interface IProductionService{
    plant(date: PlantCreateDTO): Promise<PlantDTO>;
    adjustOilStrength(data: AdjustOilStrengthDTO): Promise<PlantDTO>;
    harvest(data: HarvestDTO): Promise<{harvested:number}>;
    plantAndAdjust(plantType: string, processedOilStrength: number): Promise<PlantDTO>;
    getAllPlants(): Promise<PlantDTO[]>;
}