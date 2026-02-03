import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { Request,Response,Router } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { IProductionGateService } from "../../Domain/services/IProductionGateService";
import { UserRole } from "../../Domain/enums/UserRole";
import axios from "axios";

function handleGatewayError(
  e: unknown,
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

export class ProductionGateController {
  private readonly router: Router = Router();

  constructor(private readonly service: IProductionGateService) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    console.log("[ProductionGatewayController] Initializing routes...");
    this.router.get(
      "/production/plants",
      authenticate,
      this.getPlants
    );

    this.router.post(
      "/production/plant",
      authenticate,
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER),
      this.plant
    );

    this.router.post(
      "/production/adjust",
      authenticate,
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER),
      this.adjustOilStrength
    );

    this.router.post(
      "/production/harvest",
      authenticate,
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER),
      this.harvest
    );
  }

  private getPlants = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const plants = await this.service.getAllPlants(token);
      res.status(200).json(plants);
    } catch (e) {
      handleGatewayError(e, res, "Greška pri učitavanju biljaka", 500);
    }
  };

  private plant = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.plant(req.body, token);
      res.status(201).json(result);
    } catch (e) {
      handleGatewayError(e, res, "Greška pri sadnji biljke");
    }
  };

  private adjustOilStrength = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.adjustOilStrength(req.body, token);
      res.status(200).json(result);
    } catch (e) {
      handleGatewayError(e, res, "Greška pri podešavanju jačine ulja");
    }
  };

  private harvest = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.harvest(req.body, token);
      res.status(200).json(result);
    } catch (e) {
      handleGatewayError(e, res, "Greška pri berbi");
    }
  };

  public getRouter(): Router {
    return this.router;
  }
}