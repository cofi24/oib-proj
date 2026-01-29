import {Router,Request,Response} from "express";
import { ISalesAnalysisService } from "../../Domain/services/ISalesAnalysisService";
import { CreateSalesAnalysisReportDTO } from "../../Domain/DTOs/CreateSalesAnalysisReport.DTO";
export class SalesAnalysisController {
  private readonly router = Router();

  constructor(private readonly service: ISalesAnalysisService) {
    this.initRoutes();
  }

  private initRoutes(): void {
   
    this.router.get("/analytics/reports/summary/:period", this.summary);
    this.router.get("/analytics/reports/trend", this.trend);
    this.router.get("/analytics/reports/top10-revenue", this.top10Revenue);
    this.router.get("/analytics/reports/top10", this.top10);
    this.router.get("/analytics/reports/:id/pdf", this.pdf);
    this.router.post("/analytics/reports", this.create);
    this.router.get("/analytics/reports", this.getAll);
    this.router.get("/analytics/reports/:id", this.getById);
  }

  private create = async (req: Request, res: Response) => {
    try {
      const dto: CreateSalesAnalysisReportDTO = req.body;
      const result = await this.service.createReport(dto);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private getAll = async (_: Request, res: Response) => {
    try {
      const result = await this.service.getAllReports();
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Neispravan ID izveštaja" });
      }

      const result = await this.service.getReportById(id);
      res.json(result);
    } catch (e) {
      res.status(404).json({ message: (e as Error).message });
    }
  };

 
  private summary = async (req: Request, res: Response) => {
    try {
      const period = String(req.params.period);

      
      await this.service.getOrCreateReport(period);

     
      const result = await this.service.getSummary(period);
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

 
  private trend = async (req: Request, res: Response) => {
    try {
      const period = String(req.query.period || "month");
      const result = await this.service.getTrend(period);
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private top10 = async (_: Request, res: Response) => {
    try {
      const result = await this.service.getTop10();
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private top10Revenue = async (_: Request, res: Response) => {
    try {
      const result = await this.service.getTop10Revenue();
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private pdf = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Neispravan ID izveštaja" });
      }

      const buffer = await this.service.exportPdf(id);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report-${id}.pdf"`
      );
      res.status(200).send(buffer);
    } catch (e) {
      res.status(404).json({ message: (e as Error).message });
    }
  };

  public getRouter(): Router {
    return this.router;
  }
}
