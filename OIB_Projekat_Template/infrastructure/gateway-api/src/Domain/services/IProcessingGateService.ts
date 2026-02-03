import { StartDTO } from "../DTOs/ProcessingDTOs/StartDTO";
import { ProcessedDTO } from "../DTOs/ProcessingDTOs/ProcessedDTO";

export interface IProcessingGateService { 
    start(
    data: StartDTO,
    token?: string
  ): Promise<ProcessedDTO>;

  getBatches(token?: string): Promise<ProcessedDTO[]>;
}
