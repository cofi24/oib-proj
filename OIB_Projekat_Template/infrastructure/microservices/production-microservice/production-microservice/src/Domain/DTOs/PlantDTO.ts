import { PlantStatus } from "../enums/PlantStatus";

export interface PlantDTO{
    id: number;
    plantType: string;
    oilStrength: number;
    status: PlantStatus;
    createdAt: Date;
}