import { Request, Response, Router } from "express";
import { ISalesService } from "../../Domain/services/ISalesService";
import { GetCatalogDTO } from "../../Domain/DTOs/GetCatalogDTO";

export class SalesController {
  private readonly router: Router;

  constructor(private readonly salesService: ISalesService) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.get("/catalog", this.getCatalog.bind(this));
  }

  private async getCatalog(req: Request, res: Response) {
    try {
      // Normalizacija sortOrder (case-insensitive)
      const rawSortOrder =
        typeof req.query.sortOrder === "string"
          ? req.query.sortOrder.toLowerCase()
          : undefined;

      const query: GetCatalogDTO = {
        search:
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,

        sortBy:
          req.query.sortBy === "price" || req.query.sortBy === "name"
            ? req.query.sortBy
            : undefined,

        sortOrder:
          rawSortOrder === "asc" || rawSortOrder === "desc"
            ? rawSortOrder
            : undefined,
      };

      const result = await this.salesService.getCatalog(query);
      return res.status(200).json(result);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: err?.message ?? "Internal server error" });
    }
  }
}
