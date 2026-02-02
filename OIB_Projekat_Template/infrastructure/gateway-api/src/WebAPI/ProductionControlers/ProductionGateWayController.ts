import { Router, Request, Response } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { IProductionGatewayService } from "../../Domain/services/IProductionGatewayService";
import axios from "axios";

function handleGatewayError(
  e: Error,
  res: Response,
  fallbackMessage: string,
  defaultStatus = 400
) {
  if (axios.isAxiosError(e)) {
    return res
      .status(e.response?.status ?? 502)
      .json(e.response?.data ?? { message: e.message });
  }

  if (e instanceof Error) {
    return res.status(defaultStatus).json({ message: e.message });
  }

  return res.status(defaultStatus).json({ message: fallbackMessage });
}

export class ProductionGateWayController {
  private readonly router: Router;

  constructor(private readonly service: IProductionGatewayService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/production/plants",
      authenticate,
      this.getPlants.bind(this)
    );

    this.router.post(
      "/production/plant",
      authenticate,
      authorize("admin", "seller", "sales_manager"),
      this.plant.bind(this)
    );

    this.router.post(
      "/production/adjust",
      authenticate,
      authorize("admin", "seller", "sales_manager"),
      this.adjust.bind(this)
    );

    this.router.post(
      "/production/harvest",
      authenticate,
      authorize("admin", "seller", "sales_manager"),
      this.harvest.bind(this)
    );
  }

  private async getPlants(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const plants = await this.service.getAllPlants(token);
      res.status(200).json(plants);
    } catch (e) {
      if(e instanceof Error)
      handleGatewayError(e, res, "Greška pri učitavanju biljaka", 500);
    }
  }

  private async plant(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.plant(req.body, token);
      res.status(201).json(result);
    } catch (e) {
      if(e instanceof Error)
      handleGatewayError(e, res, "Greška pri sadnji biljke");
    }
  }

  private async adjust(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.adjust(req.body, token);
      res.status(200).json(result);
    } catch (e) {
      if(e instanceof Error)
      handleGatewayError(e, res, "Greška pri podešavanju proizvodnje");
    }
  }

  private async harvest(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.harvest(req.body, token);
      res.status(200).json(result);
    } catch (e) {
      if(e instanceof Error)
      handleGatewayError(e, res, "Greška pri žetvi");
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
