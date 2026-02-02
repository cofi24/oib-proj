import { Router, Request, Response } from "express";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { IProcessingGatewayService } from "../../Domain/services/IProcessingGatewayService";
import axios from "axios";

function handleError(e: Error, res: Response, fallbackMessage: string) {
  if (axios.isAxiosError(e)) {
    return res
      .status(e.response?.status ?? 502)
      .json(e.response?.data ?? { message: e.message });
  }

  if (e instanceof Error) {
    return res.status(400).json({ message: e.message });
  }

  return res.status(400).json({ message: fallbackMessage });
}

export class ProcessingGatewayController {
  private readonly router = Router();

  constructor(private readonly service: IProcessingGatewayService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/start", authenticate, this.start);
    this.router.get("/batches", authenticate, this.batches);
  }

  private start = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.start(req.body, token);
      res.status(201).json(result);
    } catch (e) {
      if(e instanceof Error)
      return handleError(e, res, "Greška pri pokretanju prerade");
    }
  };

  private batches = async (_req: Request, res: Response) => {
    try {
      const token = _req.headers.authorization?.split(" ")[1];
      const result = await this.service.getBatches(token);
      res.json(result);
    } catch (e) {
      if(e instanceof Error)
      return handleError(e, res, "Greška pri učitavanju batch-eva");
    }
  };

  getRouter() {
    return this.router;
  }
}