import { Router, Request, Response } from "express";
import { IProcessingService } from "../../Domain/services/IProcessingService";
import { validateStartProcessing } from "../validators/StartProcessingValidator";

export class ProcessingController {
  private readonly router = Router();

  constructor(private readonly service: IProcessingService) {
    this.router.get("/batches", this.getAll);
    this.router.get("/batches/:id", this.getById);
    this.router.post("/start", this.start);
   
  }

  private getAll = async (_: Request, res: Response) => {
    res.json(await this.service.getAll());
  };

  private getById = async (req: Request, res: Response) => {
    try {
      res.json(await this.service.getById(Number(req.params.id)));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Batch not found";
      res.status(404).json({ message });
    }
  };

private start = async (req: Request, res: Response) => {
  const v = validateStartProcessing(req.body);
  if (!v.success) {
    return res.status(400).json({ message: v.message });
  }

  try {
    const authHeader = req.headers.authorization;
if (!authHeader) {
  return res.status(401).json({ message: "Missing Authorization header" });
}

const jwtToken = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : authHeader;

const result = await this.service.start(req.body, jwtToken);
    res.status(201).json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Processing failed";
    res.status(400).json({ message });
  }
};



 
  
  getRouter() {
    return this.router;
  }
}
