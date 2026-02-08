import { Repository } from "typeorm";
import { ProcessedBatch } from "../Domain/models/ProcessedBatch";
import { IProcessingService } from "../Domain/services/IProcessingService";
import { StartProcessingDTO } from "../Domain/DTOs/StartProcessingDTO";
import { ProcessedBatchDTO } from "../Domain/DTOs/ProcessedBatchDTO";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { IProductionClient } from "../Domain/services/IProductionClient";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { PerfumeDTO } from "../Domain/DTOs/PerfumeDTO";

export class ProcessingService implements IProcessingService {
  constructor(
    private readonly repo: Repository<ProcessedBatch>,
    private readonly audit: IAuditingService,
    private readonly production: IProductionClient
  ) {}

  private normalizePlantType(perfumeType: string): string {
    return perfumeType.trim();
  }

  async start(data: StartProcessingDTO,token:string): Promise<ProcessedBatchDTO> {
    const totalMl = data.bottleCount * data.bottleVolumeMl;
    const plantsNeeded = Math.ceil(totalMl / 50);
    const plantType = this.normalizePlantType(data.perfumeType);

    await this.audit.log(
      AuditLogType.INFO,
      `Start processing: parfem=${data.perfumeType}, boca=${data.bottleCount}x${data.bottleVolumeMl}ml, ukupno=${totalMl}ml`
    );

    const harvest = await this.production.harvest(
      plantType,
      plantsNeeded,
      token

    );

    if (!harvest || typeof harvest.harvested !== "number") {
      await this.audit.log(
        AuditLogType.ERROR,
        "Neuspesno"
      );
      throw new Error("Nesupesno");
    }

    const batch = this.repo.create({
      perfumeType: plantType,
      bottleCount: data.bottleCount,
      bottleVolumeMl: data.bottleVolumeMl,
      totalMl,
      plantsNeeded,
    });

    const saved = await this.repo.save(batch);

    await this.audit.log(
      AuditLogType.INFO,
      `Processing completed: batchId=${saved.id}, harvested=${harvest.harvested}/${plantsNeeded}`
    );

    return saved;
  }

  async getAll(): Promise<ProcessedBatchDTO[]> {
    return this.repo.find({
      order: { createdAt: "DESC" },
    });
  }

  async getById(id: number): Promise<ProcessedBatchDTO> {
    const batch = await this.repo.findOne({ where: { id } });
    if (!batch) {
      throw new Error("Nije pronadjen");
    }
    return batch;
  }
}
