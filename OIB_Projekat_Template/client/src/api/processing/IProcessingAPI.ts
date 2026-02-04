import { AmountDTO } from "../../models/processing/AmountDTO";
import { StartDTO } from "../../models/processing/StartDTO";

export interface IProcessingAPI {
  startProcessingBatch(token:string,data: StartDTO): Promise<AmountDTO>;
  getProcessedAmounts(token:string): Promise<AmountDTO[]>;
}