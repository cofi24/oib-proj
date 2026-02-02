import { AppDataSource } from "../Database/DbConnectionPool";
import { Plant } from "../Domain/models/Plant";
import { IProductionService } from "../Domain/services/IProductionService";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { PlantCreateDTO } from "../Domain/DTOs/PlantCreateDTO";
import { AdjustOilStrengthDTO } from "../Domain/DTOs/AdjustOilStrengthDTO";
import { HarvestDTO } from "../Domain/DTOs/HarvestDTO";
import { PlantDTO } from "../Domain/DTOs/PlantDTO";
import { PlantStatus } from "../Domain/enums/PlantStatus";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { OilStrengthCalculator } from "../Domain/helpers/OilStrengthCalculator";
import { RandomGenerator } from "../Domain/helpers/RandomGenerator";

export class ProductionService implements IProductionService {
  constructor(private readonly audit: IAuditingService) {}

  private repo() {
    return AppDataSource.getRepository(Plant);
  }

  async getAllPlants(): Promise<PlantDTO[]> {
    return this.repo().find({ order: { createdAt: "DESC" } });
  }

  async plant(data: PlantCreateDTO): Promise<PlantDTO> {
    const originalOil = RandomGenerator.generateOilStrength();

    const plant = this.repo().create({
      plantType: data.plantType.trim(),
      oilStrength: originalOil,
      status: PlantStatus.PLANTED,
    });

    if (OilStrengthCalculator.needsAutoBalance(plant.oilStrength)) {
      const balancedOil = OilStrengthCalculator.autoBalance(
        plant.oilStrength,
        plant.oilStrength
      );

      plant.oilStrength = balancedOil;

      const factor = OilStrengthCalculator.getBalanceFactor(originalOil);

      await this.audit.log(
        AuditLogType.INFO,
        `auto-balance (${plant.plantType}): ${originalOil} → ${plant.oilStrength} (${factor}%)`
      );
    }

    const saved = await this.repo().save(plant);

    await this.audit.log(
      AuditLogType.INFO,
      `zasađeno ${saved.plantType} (id=${saved.id}, ulje=${saved.oilStrength})`
    );

    return saved;
  }

  async adjustOilStrength(data: AdjustOilStrengthDTO): Promise<PlantDTO> {
    const plant = await this.repo().findOne({ where: { id: data.plantID } });

    if (!plant) {
      throw new Error("Plant not found");
    }

    const oldOil = plant.oilStrength;
    const newOil = OilStrengthCalculator.adjustByPercent(oldOil, data.percent);

    plant.oilStrength = newOil;

    const saved = await this.repo().save(plant);

    await this.audit.log(
      AuditLogType.INFO,
      `preradjeno ${oldOil} → ${saved.oilStrength} (${data.percent}%)`
    );

    return saved;
  }

  async harvest(data: HarvestDTO): Promise<{ harvested: number }> {
    const plantType = data.plantType.trim();

    const available = await this.repo().count({
      where: {
        plantType,
        status: PlantStatus.PLANTED,
      },
    });

    const missing = Math.max(0, data.quantity - available);
    for (let i = 0; i < missing; i++) {
      await this.plant({ plantType });
    }

    const toHarvest = await this.repo().find({
      where: {
        plantType,
        status: PlantStatus.PLANTED,
      },
      order: { createdAt: "ASC" },
      take: data.quantity,
    });

    toHarvest.forEach((plant) => {
      plant.status = PlantStatus.HARVESTED;
    });

    await this.repo().save(toHarvest);

    await this.audit.log(
      AuditLogType.INFO,
      `sažetak berbe (${plantType}): zatraženo=${data.quantity}, ubrano=${toHarvest.length}, automatski_zasađeno=${missing}`
    );

    return { harvested: toHarvest.length };
  }

  async plantAndAdjust(
    plantType: string,
    processedOilStrength: number
  ): Promise<PlantDTO> {
    const originalOil = RandomGenerator.generateOilStrength();

    const plant = this.repo().create({
      plantType: plantType.trim(),
      oilStrength: originalOil,
      status: PlantStatus.PLANTED,
    });

    const balancedOil = OilStrengthCalculator.autoBalance(
      originalOil,
      processedOilStrength
    );

    plant.oilStrength = balancedOil;

    const saved = await this.repo().save(plant);

    const factor = OilStrengthCalculator.getBalanceFactor(processedOilStrength);

    await this.audit.log(
      AuditLogType.INFO,
      `auto-balance (${plantType}): processed=${processedOilStrength}, ${originalOil} → ${saved.oilStrength} (${factor}%)`
    );

    return saved;
  }
}