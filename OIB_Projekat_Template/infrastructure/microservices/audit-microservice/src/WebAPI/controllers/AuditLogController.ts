import { Router, Request, Response } from "express";
import { IAuditLogService } from "../../Domain/services/IAuditLogService";

export class AuditLogController {
  private readonly router = Router();

  constructor(private readonly service: IAuditLogService) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/audit", this.getAll);
    this.router.get("/audit/:id", this.getById);
    this.router.post("/audit", this.create);
    this.router.put("/audit/:id", this.update);
    this.router.delete("/audit/:id", this.delete);
  }

  private getAll = async (_: Request, res: Response) => {
    res.json(await this.service.getAll());
  };

  private getById = async (req: Request, res: Response) => {
    try {
      res.json(await this.service.getById(Number(req.params.id)));
    } catch (e) {
      res.status(404).json({ message: (e as Error).message });
    }
  };

  private create = async (req: Request, res: Response) => {
   

    const result = await this.service.create(req.body);
    res.status(201).json(result);
  };

  private update = async (req: Request, res: Response) => {
   

  

    const result = await this.service.update(
      Number(req.params.id),
      req.body
    );

    res.json(result);
  };

  private delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(404).json({ message: (e as Error).message });
    }
  };

  getRouter(): Router {
    return this.router;
  }
}