export interface IProductionClient{
    harvest(plantType: string, quantity: number, token?:string): Promise<{harvested: number}>;
    plantAndAdjust(plantType: string, processedOilSt5ength: number, token?: string): Promise<>;
}