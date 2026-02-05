import {Request,Response, Router} from "express";
import { IStorageGateService } from "../../Domain/services/IStorageGateService";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";
import { SendPackagingDTO } from "../../Domain/DTOs/StorageDTOs/SendPackagingDTO";

export class StorageGateController {
  private readonly router: Router;

  constructor(private readonly storageService: IStorageGateService) {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    console.log("[StorageGatewayController] Initializing routes...");

    this.router.post(
      "/storage/send-packaging",
      authenticate,
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER),
      this.sendPackaging.bind(this)
    );
  }

  private forwardHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    if (req.headers.authorization)
      headers["Authorization"] = String(req.headers.authorization);

    if (req.user?.role) headers["x-user-role"] = String(req.user.role);
    if (req.user?.id != null) headers["x-user-id"] = String(req.user.id);
    if ((req.user as any)?.username)
      headers["x-user-name"] = String((req.user as any).username);

    if (process.env.GATEWAY_SECRET)
      headers["x-gateway-key"] = process.env.GATEWAY_SECRET;

    return headers;
  }

  private async sendPackaging(req: Request, res: Response) {
    try {
      console.log("[StorageController] User:", req.user);
      console.log("[StorageController] Body:", req.body);
      
      const amount = Number(req.body?.amount);
      
      // Validacija
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Uzmi role iz JWT tokena, ne iz body-a!
      const role = req.user?.role || UserRole.SELLER;

      const payload: SendPackagingDTO = {
        role: role,
        amount: amount
      };

      const result = await this.storageService.sendPackaging(
        payload,
        this.forwardHeaders(req)
      );

      // Vrati rezultat umesto 204
      return res.status(200).json(result);
    } catch (err: any) {
      console.error("[StorageController] Error:", err);
      return res
        .status((err as any).status ?? 500)
        .json({ message: err.message ?? "Storage error" });
    }
  }

  getRouter(): Router {
    return this.router;
  }
}