import { Router, Request, Response } from "express";
import { IProcessingService } from "../../Domain/services/IProcessingService";
import { validateStartProcessing } from "../validators/StartProcessingValidator";

export class ProcessingController {
  private readonly router = Router();

  constructor(private readonly service: IProcessingService) {
    this.router.get("/batches", this.getAll);
    this.router.get("/batches/:id", this.getById);
    this.router.post("/start", this.start);
    this.router.get("/perfumes", this.getCatalog);
    this.router.post("/perfumes/:id/sell", this.registerSale);
  }

  private getAll = async (_: Request, res: Response) => {
    res.json(await this.service.getAll());
  };

  private getById = async (req: Request, res: Response) => {
    try {
      res.json(await this.service.getById(Number(req.params.id)));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Batch not found";
      res.status(404).json({ message });
    }
  };

  private start = async (req: Request, res: Response) => {
    const v = validateStartProcessing(req.body);
    if (!v.success) return res.status(400).json({ message: v.message });

    try {
      const result = await this.service.start(req.body);
      res.status(201).json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Processing failed";
      res.status(400).json({ message });
    }
  };

  private getCatalog = async (_: Request, res: Response) => {
    try {
      const catalog = await this.service.getCatalog();
      res.json(catalog);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch catalog";
      res.status(500).json({ message });
    }
  };

  private registerSale = async (req: Request, res: Response) => {
    try {
      const perfumeId = Number(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      await this.service.registerSale(perfumeId, quantity);
      res.status(200).json({ success: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to register sale";
      res.status(400).json({ message });
    }
  };
  
  getRouter() {
    return this.router;
  }
}
