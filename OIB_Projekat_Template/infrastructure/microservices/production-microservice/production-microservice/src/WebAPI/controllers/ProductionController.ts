import { Router, Request, Response } from "express";
import { IProductionService } from "../../Domain/services/IProductionService";

export class ProductionController {
  private readonly router = Router();

  constructor(private readonly service: IProductionService) {
    this.router.get("/plants", this.getAll);
    this.router.post("/plant", this.plant);
    this.router.post("/adjust", this.adjust);
    this.router.post("/harvest", this.harvest);
    this.router.post("/production/balance", this.balance);
  }

  private getAll = async (_: Request, res: Response) => {
    res.json(await this.service.getAllPlants());
  };

  private plant = async (req: Request, res: Response) => {
    try {
      res.status(201).json(await this.service.plant(req.body));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Greška pri sadnji biljke";

      res.status(400).json({ message });
    }
  };

  private adjust = async (req: Request, res: Response) => {
    try {
      res.json(await this.service.adjustOilStrength(req.body));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Greška pri podešavanju jačine ulja";

      res.status(400).json({ message });
    }
  };

  private harvest = async (req: Request, res: Response) => {
    try {
      res.json(await this.service.harvest(req.body));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Greška pri berbi";

      res.status(400).json({ message });
    }
  };

  private balance = async (req: Request, res: Response) => {
    try {
      const { plantType, processedOilStrength } = req.body;

      const result = await this.service.plantAndAdjust(
        plantType,
        processedOilStrength
      );

      res.json(result);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Greška pri balansiranju proizvodnje";

      res.status(400).json({ message });
    }
  };

  getRouter() {
    return this.router;
  }
}
