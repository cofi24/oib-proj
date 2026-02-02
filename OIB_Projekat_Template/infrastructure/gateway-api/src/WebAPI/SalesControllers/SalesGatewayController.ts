import { Router, Request, Response } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { ISalesGatewayService } from "../../Domain/services/ISalesGatewayService";

export class SalesGatewayController {
  private readonly router = Router();

  constructor(private readonly service: ISalesGatewayService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/catalog", authenticate, this.catalog);
    this.router.post("/checkout", authenticate, this.checkout);

    this.router.get("/health", this.health);
  }

  private health = async (_: Request, res: Response) => {
    try {
      const result = await this.service.health();
      res.json(result);
    } catch (e ) {
      res.status(502).json({ message: "Sales service unavailable" });
    }
  };

  private catalog = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.getCatalog(token);
      res.json(result);
    } catch (e) {
      res.status(502).json({ message:   "Greška pri čitanju kataloga" });
    }
  };

  private checkout = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      const userRole = (req.user?.role ?? "").toString();

      const result = await this.service.checkout(req.body, token, userRole);
      return res.status(201).json(result);
    } catch (e) {
      const status =  502;
      return res.status(status).json({ message:"Greška pri checkout-u" });
    }
  };

  getRouter() {
    return this.router;
  }
}

