import { Router,Request,Response } from "express";
import { IAuditGateService } from "../../Domain/services/IAuditGateService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";

import { UserRole } from "../../Domain/enums/UserRole";

export class AuditController {
  private readonly router = Router();

  constructor(private readonly service: IAuditGateService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/audit", authenticate, this.getAll);
    this.router.get("/audit/:id", authenticate, this.getById);

    this.router.post("/audit", authenticate, this.create);
    this.router.put("/audit/:id", authenticate, this.update);
    this.router.delete("/audit/:id", authenticate, this.delete);
  }

  private getAll = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getAll(token));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch audit logs";

      console.error("Get all audit logs error:", message);
      res.status(500).json({ message });
    }
  };

  private getById = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getById(Number(req.params.id), token));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch audit log";

      console.error("Get audit log by ID error:", message);
      res.status(500).json({ message });
    }
  };

  private create = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.status(201).json(await this.service.create(req.body, token));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create audit log";

      console.error("Create audit log error:", message);
      res.status(500).json({ message });
    }
  };

  private update = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.update(Number(req.params.id), req.body, token));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update audit log";

      console.error("Update audit log error:", message);
      res.status(500).json({ message });
    }
  };

  private delete = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      await this.service.delete(Number(req.params.id), token);
      res.status(204).send();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete audit log";

      console.error("Delete audit log error:", message);
      res.status(500).json({ message });
    }
  };

  getRouter() {
    return this.router;
  }
}