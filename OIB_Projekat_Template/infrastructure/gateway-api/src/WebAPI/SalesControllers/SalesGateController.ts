import { Request,Response,Router } from "express";
import { ISalesGateService } from "../../Domain/services/ISalesGateService";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { GetCatalogDTO } from "../../Domain/DTOs/SalesDTOs/GetCatalogDTO";
import { BuyRequestDTO } from "../../Domain/DTOs/SalesDTOs/BuyRequestDTO";
export class SalesGateController {
  private readonly router: Router;

  constructor(private readonly salesService: ISalesGateService) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
 console.log("[SalesGatewayController] Initializing routes...");

    this.router.get(
      "/sales/catalog",
      authenticate,
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER),
      this.getCatalog.bind(this)
    );

    this.router.post(
      "/sales/buy",
      authenticate,
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER),
      this.buy.bind(this)
    );
  }

  private forwardHeaders(req: Request): Record<string, string> {
    // minimum koji sales-service koristi:
    const role = String(req.user?.role ?? "");
    const headers: Record<string, string> = {
      "x-user-role": role,
    };

    // opciono (ako već koristiš svuda):
    if (req.user?.id != null) headers["x-user-id"] = String(req.user.id);
    if ((req.user as any)?.username) headers["x-user-name"] = String((req.user as any).username);
    if (req.headers.authorization) headers["Authorization"] = String(req.headers.authorization);
    if (process.env.GATEWAY_SECRET) headers["x-gateway-key"] = process.env.GATEWAY_SECRET;

    return headers;
  }

  private async getCatalog(req: Request, res: Response) {
    try {
      const rawSortOrder =
        typeof req.query.sortOrder === "string" ? req.query.sortOrder.toLowerCase() : undefined;

      const query: GetCatalogDTO = {
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        sortBy: req.query.sortBy === "price" || req.query.sortBy === "name" ? req.query.sortBy : undefined,
        sortOrder: rawSortOrder === "asc" || rawSortOrder === "desc" ? rawSortOrder : undefined,
      };

      const data = await this.salesService.getCatalog(query, this.forwardHeaders(req));
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status((err as any).status ?? 500).json({ message: err?.message ?? "Server error" });
    }
  }

  private async buy(req: Request, res: Response) {
    try {
      const payload = req.body as BuyRequestDTO;
      const data = await this.salesService.buy(payload, this.forwardHeaders(req));
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status((err as any).status ?? 500).json({ message: err?.message ?? "Server error" });
    }
  }

  getRouter(): Router {
    return this.router;
  }
}