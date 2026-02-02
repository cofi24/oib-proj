import { Router, Request, Response } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { IPerformanceGatewayService } from "../../Domain/services/IPerformanceGatewayService";
import axios from "axios";

function getErrorPayload(e: Error) {
  if (axios.isAxiosError(e)) {
    return {
      status: e.response?.status ?? 502,
      data: e.response?.data,
      message: e.message,
    };
  }

  if (e instanceof Error) {
    return {
      status: 502,
      data: null,
      message: e.message,
    };
  }

  return {
    status: 502,
    data: null,
    message: "Nepoznata greška",
  };
}

export class PerformanceGatewayController {
  private readonly router = Router();

  constructor(private readonly service: IPerformanceGatewayService) {
    this.initRoutes();
  }

  private initRoutes() {
    
    this.router.post("/simulate", authenticate, this.simulate);
    this.router.get("/reports/:id/pdf", authenticate, this.exportPdf);
    this.router.post("/reports", authenticate, this.createReport);
    this.router.get("/reports", authenticate, this.getReports);
    this.router.get("/reports/:id", authenticate, this.getReportById);
    this.router.get("/health", this.health);
  }

  private health = async (_: Request, res: Response) => {
    try {
      const result = await this.service.health();
      res.json(result);
    }catch (e) {
      if(e instanceof Error){
      const err = getErrorPayload(e);
      
      if (err.data) return res.status(err.status).json(err.data);
      return res.status(err.status).json({ message: err.message });
      }
    }
  };

  private simulate = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.simulate(req.body, token);
      return res.json(result);
    } catch (e) {
      if(e instanceof Error){
      const err = getErrorPayload(e);

      if (err.data) return res.status(err.status).json(err.data);
      return res.status(err.status).json({ message: err.message });
      }
    }
  };

  private createReport = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.createReport(req.body, token);
      return res.status(201).json(result);
    } catch (e) {
      if(e instanceof Error){
        const err = getErrorPayload(e);

        if (err.data) return res.status(err.status).json(err.data);
        return res.status(err.status).json({ message: err.message });
      }
      }
  };

  private getReports = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.getReports(token);
      return res.json(result);
    } catch (e) {
      if(e instanceof Error){
      const err = getErrorPayload(e);

      if (err.data) return res.status(err.status).json(err.data);
      return res.status(err.status).json({ message: err.message });
      }
    }
  };

  private getReportById = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const id = Number(req.params.id);
      const result = await this.service.getReportById(id, token);
      return res.json(result);
    } catch (e) {
      if(e instanceof Error)
      {
      const err = getErrorPayload(e);

      if (err.data) return res.status(err.status).json(err.data);
      return res.status(err.status).json({ message: err.message });
      }
    }
  };

  private exportPdf = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const id = Number(req.params.id);

      const { buffer, filename } = await this.service.exportPdf(id, token);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      return res.status(200).send(buffer);
    } catch (e) {
      if(e instanceof Error){
      const err = getErrorPayload(e);

      if (err.data) return res.status(err.status).json(err.data);
      return res.status(err.status).json({ message: err.message });
      }
    }
  };

  public getRouter(): Router {
    return this.router;
  }
}
