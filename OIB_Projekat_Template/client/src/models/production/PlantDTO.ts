import { Plant } from "../../enums/Plant";

export interface PlantDTO{
    id: number;
    plantType: string;
    oilStrength: number;
    status: Plant;
    createdAt: Date;
}