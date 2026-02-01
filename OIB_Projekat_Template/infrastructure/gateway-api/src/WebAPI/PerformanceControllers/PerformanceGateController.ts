import { IPerformanceGateService } from "../../Domain/services/IPerformanceGateService";
import { Router,Request,Response } from "express"; 
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { RunSimulationDTO } from "../../Domain/DTOs/Performance-analysis/RunSimulationDTO";
import { PerformanceGateService } from "../../Services/PerformanceService/PerformanceGateService"; 
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import {buildInternalHeaders} from "../../helper/buildInternalHeaders";
import { validateDTO } from "../../Middlewares/validation/ValidationMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";



export class PerformanceGateController {
    private readonly router: Router;

    constructor(private readonly performanceService: IPerformanceGateService) {
        this.router = Router();
        this.initializeRoutes();
    }
private initializeRoutes(): void {
  console.log("[PerformanceGatewayController] Initializing routes...");
    this.router.post(
      "/performance/simulate",
      authenticate,
      authorize(UserRole.ADMIN),
      validateDTO(RunSimulationDTO),
      this.runSimulation.bind(this)
    );

    this.router.get(
      "/performance/reports",
      authenticate,
      authorize(UserRole.ADMIN),
      this.listPerformanceReports.bind(this)
    );

    this.router.get(
      "/performance/reports/:id",
      authenticate,
      authorize(UserRole.ADMIN),
      this.getPerformanceReportById.bind(this)
    );

    this.router.get(
      "/performance/reports/:id/pdf",
      authenticate,
      authorize(UserRole.ADMIN),
      this.getPerformanceReportPdf.bind(this)
    );
  }


     private async runSimulation(req: Request, res: Response) {
    const headers = buildInternalHeaders(req);

    const result = await this.performanceService.runSimulation(
      req.body.algorithmName,
      headers
    );

    res.status(201).json(result);
  }

  private async listPerformanceReports(req: Request, res: Response) {
    const headers = buildInternalHeaders(req);
    const result = await this.performanceService.listPerformanceReports(headers);
    res.json(result);
  }

  private async getPerformanceReportById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const headers = buildInternalHeaders(req);
    const result = await this.performanceService.getPerformanceReportById(
      id,
      headers
    );

    res.json(result);
  }

  private async getPerformanceReportPdf(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid report id" });
    }

    const headers = buildInternalHeaders(req);
    const { buffer, contentType, filename } =
      await this.performanceService.getPerformanceReportPdf(id, headers);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  public getRouter(): Router {
    return this.router;
  }

}