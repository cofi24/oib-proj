import { Request, Response, Router } from "express";
import { ISalesService } from "../../Domain/services/ISalesService";
import { GetCatalogDTO } from "../../Domain/DTOs/GetCatalogDTO";
import { BuyRequestDTO } from "../../Domain/DTOs/BuyRequestDTO";
import { SaleType } from "../../Domain/enums/SaleType";
import { PaymentMethod } from "../../Domain/enums/PaymentMethod";

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
    this.router.post("/buy", this.buy.bind(this));
  }

  // Helper metoda za prosleđivanje headera
  private forwardHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (req.headers["x-user-role"]) {
      headers["x-user-role"] = String(req.headers["x-user-role"]);
    }
    if (req.headers["x-user-id"]) {
      headers["x-user-id"] = String(req.headers["x-user-id"]);
    }
    if (req.headers["x-user-name"]) {
      headers["x-user-name"] = String(req.headers["x-user-name"]);
    }
    if (req.headers["authorization"]) {
      headers["authorization"] = String(req.headers["authorization"]);
    }
    if (req.headers["x-gateway-key"]) {
      headers["x-gateway-key"] = String(req.headers["x-gateway-key"]);
    }

    return headers;
  }

  private async getCatalog(req: Request, res: Response) {
    try {
      const rawSortOrder =
        typeof req.query.sortOrder === "string"
          ? req.query.sortOrder.toLowerCase()
          : undefined;

      const query: GetCatalogDTO = {
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        sortBy:
          req.query.sortBy === "price" || req.query.sortBy === "name"
            ? req.query.sortBy
            : undefined,
        sortOrder:
          rawSortOrder === "asc" || rawSortOrder === "desc" ? rawSortOrder : undefined,
      };

      // PROSLEDI HEADERS! ✅
      const result = await this.salesService.getCatalog(query, this.forwardHeaders(req));
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("[SalesController] getCatalog error:", err);
      return res.status(500).json({ message: err?.message ?? "Internal server error" });
    }
  }

  private parseSaleType(value: any): SaleType {
    if (value === SaleType.RETAIL) return SaleType.RETAIL;
    if (value === SaleType.WHOLESALE) return SaleType.WHOLESALE;
    throw new Error("Invalid saleType.");
  }

  private parsePaymentMethod(value: any): PaymentMethod {
    if (value === PaymentMethod.CASH) return PaymentMethod.CASH;
    if (value === PaymentMethod.CARD) return PaymentMethod.CARD;
    if (value === PaymentMethod.BANK_TRANSFER) return PaymentMethod.BANK_TRANSFER;
    throw new Error("Invalid paymentMethod.");
  }

  private async buy(req: Request, res: Response) {
    try {
      const userRole = String(req.headers["x-user-role"] ?? "").trim() || "SELLER";

      const body = req.body as Partial<BuyRequestDTO>;

      const request: BuyRequestDTO = {
        saleType: this.parseSaleType(body.saleType),
        paymentMethod: this.parsePaymentMethod(body.paymentMethod),
        items: Array.isArray(body.items) ? body.items : [],
      };

      const receipt = await this.salesService.buy(userRole, request);
      return res.status(200).json(receipt);
    } catch (err: any) {
      const msg = err?.message ?? "Server error";
      console.error("[SalesController] buy error:", err);

      if (msg.includes("Analytics fetch failed") || msg.includes("Storage fetch failed")) {
        return res.status(503).json({ message: msg });
      }
      return res.status(400).json({ message: msg });
    }
  }
}