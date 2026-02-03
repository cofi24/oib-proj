import {Router,Request,Response} from "express";
import { IProcessingGateService } from "../../Domain/services/IProcessingGateService";

import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import axios from "axios";

function handleError(
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

export class ProcessingGateController {
  private readonly router = Router();

  constructor(private readonly service: IProcessingGateService) {
    this.initRoutes();
  }

  private initRoutes() {
    console.log("[ProcesssingGateController] Initializing routes...");
    this.router.post("/processing/start", authenticate, this.start);
    this.router.get("/processing/batches", authenticate, this.batches);
  }

  private start = async (req: Request, res: Response) => {
    try {
     


      const token = req.headers.authorization?.split(" ")[1];
      console.log("[GATEWAY] token:", token);

      const result = await this.service.start(req.body, token);
      res.status(201).json(result);
    } catch (e) {
      handleError(e, res, "Greška  prerade");
    }
  };

  private batches = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const result = await this.service.getBatches(token);
      res.json(result);
    } catch (e) {
      handleError(e, res, "Greška  batch-eva");
    }
  };

  getRouter() {
    return this.router;
  }
}