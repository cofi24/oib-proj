import { Router,Request,Response } from "express";
import { IFiscalReceiptService } from "../../Domain/services/IReceiptService";
import { FiscalReceiptDTO } from "../../Domain/DTOs/ReceiptDTO";


export class FiscalReceiptController {
  private readonly router = Router();

  constructor(private readonly service: IFiscalReceiptService) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/analytics/receipts/:id/pdf", this.pdf);
    this.router.post("/analytics/receipts", this.create);
    this.router.get("/analytics/receipts", this.getAll);
    this.router.get("/analytics/receipts/:id", this.getById);
    
  }

  private create = async (req: Request, res: Response) => {
    try {
      const dto: FiscalReceiptDTO = req.body;
      const result = await this.service.create(dto);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private getAll = async (_: Request, res: Response) => {
    try {
      const result = await this.service.getAll();
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: (e as Error).message });
    }
  };

  private getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await this.service.getById(id);
      res.json(result);
    } catch (e) {
      res.status(404).json({ message: (e as Error).message });
    }
  };

private pdf = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Neispravan ID računa" });
    }

    const buffer = await this.service.exportPdf(id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="racun-${id}.pdf"`
    );
   res.setHeader("Cache-Control", "no-store, max-age=0");

    res.status(200).send(buffer);
  } catch (e) {
    res.status(404).json({ message: (e as Error).message });
  }
};


  public getRouter(): Router {
    return this.router;
  }
}