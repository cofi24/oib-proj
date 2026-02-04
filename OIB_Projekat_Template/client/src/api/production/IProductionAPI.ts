export interface IProductionAPI {
     adjust<T>(token: string, plantId: number, percent: number): Promise<T>;
     harvest<T>(token: string, plantType: string, quantity: number): Promise<T>;
    balance<T>(token: string, plantType: string, OilStrength: number): Promise<T>;
    
    getAllPlants<T>(token: string): Promise<T[]>;
    plant<T>(token: string, plantType: string): Promise<T>;
   

}