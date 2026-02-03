import { ProcessedBatchDTO } from "../DTOs/ProcessedBatchDTO";
import { StartProcessingDTO } from "../DTOs/StartProcessingDTO";
import { PerfumeDTO } from "../DTOs/PerfumeDTO";

export interface IProcessingService {
  start(data: StartProcessingDTO,token:string): Promise<ProcessedBatchDTO>;
  getAll(): Promise<ProcessedBatchDTO[]>;
  getById(id: number): Promise<ProcessedBatchDTO>;

 
}