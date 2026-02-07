import {Router,Request,Response} from "express";
import { IAnalyticsGateService } from "../../Domain/services/IAnalyticsGateService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import axios from "axios";

export class AnalyticsGateController {
  private readonly router = Router();

  constructor(private readonly service: IAnalyticsGateService) {
    this.initRoutes();
  }

  private initRoutes() {
    
    
    
    this.router.post("/reports", authenticate, this.createReport);
    this.router.get("/reports", authenticate, this.getReports);
    this.router.get("/reports/summary/:period", authenticate, this.getSummary);
    this.router.get("/reports/trend", authenticate, this.getTrend);
    this.router.get("/reports/top10/revenue", authenticate, this.getTop10Revenue);
    this.router.get("/reports/top10", authenticate, this.getTop10);
    this.router.get("/reports/:id/pdf", authenticate, this.exportPdf);
    this.router.get("/reports/:id", authenticate, this.getReportById);
    this.router.get("/receipts/:id/pdf", authenticate, this.exportReceiptPdf);
    this.router.post("/receipts", authenticate, this.createReceipt);
    this.router.get("/receipts", authenticate, this.getReceipts);
    this.router.get("/receipts/:id", authenticate, this.getReceiptById);
    
    console.log("[AnalyticsGatewayController] All routes initialized");
  }

  private handleError(res: Response, error: Error, fallback: string) {
    let status = 502;
    let message = fallback;

    if (axios.isAxiosError(error)) {
      status = error.response?.status ?? 502;
      message = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return res.status(status).json({ message });
  }

  private getToken(req: Request) {
    return req.headers.authorization?.split(" ")[1];
  }

  private createReport = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createReport(req.body, this.getToken(req));
      return res.status(201).json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Create report error:", error);
      this.handleError(res, error, "Greška pri kreiranju izveštaja");
      }
    }
  };

  private getReports = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getReports(this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get reports error:", error);
      this.handleError(res, error, "Greška pri čitanju izveštaja");
      }
    }
  };

  private getReportById = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getReportById(Number(req.params.id), this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get report by id error:", error);
      this.handleError(res, error, "Greška pri čitanju izveštaja");
      }
    }
  };

  private getSummary = async (req: Request, res: Response) => {
    try {
      const period = String(req.params.period);
      const result = await this.service.getSummary(period, this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get summary error:", error);
      this.handleError(res, error, "Greška pri summary analizi");
      }
    }
  };

  private getTrend = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getTrend(this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get trend error:", error);
      this.handleError(res, error, "Greška pri trend analizi");
      }
    }
  };

  private getTop10 = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getTop10(this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get top10 error:", error);
      this.handleError(res, error, "Greška pri top10");
      }
    }
  };

  private getTop10Revenue = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getTop10Revenue(this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get top10 revenue error:", error);
      this.handleError(res, error, "Greška pri top10 revenue");
      }
    }
  };

  private exportPdf = async (req: Request, res: Response) => {
    try {
      const { buffer, filename } = await this.service.exportPdf(
        Number(req.params.id),
        this.getToken(req)
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="racun-${Date.now()}.pdf"`
      );
      res.setHeader("Cache-Control", "no-store");
      return res.status(200).send(buffer);
    } catch (error) {
      if(error instanceof Error){
      console.error("Export pdf error:", error);
      this.handleError(res, error, "Greška pri PDF exportu");
    }
  }
  };

  private createReceipt = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createReceipt(req.body, this.getToken(req));
      return res.status(201).json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Create receipt error:", error);
      this.handleError(res, error, "Greška pri kreiranju računa");
      }
    }
  };

  private getReceipts = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getReceipts(this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get receipts error:", error);
      this.handleError(res, error, "Greška pri čitanju računa");
      }
    }
  };

  private getReceiptById = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getReceiptById(Number(req.params.id), this.getToken(req));
      return res.json(result);
    } catch (error) {
      if(error instanceof Error){
      console.error("Get receipt by id error:", error);
      this.handleError(res, error, "Greška pri čitanju računa");
      }
    }
  };

  private exportReceiptPdf = async (req: Request, res: Response) => {
    try {
      const { buffer, filename } = await this.service.exportReceiptPdf(
        Number(req.params.id),
        this.getToken(req)
      );

      res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="racun-${Date.now()}.pdf"`
          );
          res.setHeader("Cache-Control", "no-store");
      return res.status(200).send(buffer);
    } catch (error) {
      if(error instanceof Error){
      console.error("Export receipt pdf error:", error);
      this.handleError(res, error, "Greška pri PDF exportu računa");
      }
    }
  };

  public getRouter(): Router {
    return this.router;
  }
}