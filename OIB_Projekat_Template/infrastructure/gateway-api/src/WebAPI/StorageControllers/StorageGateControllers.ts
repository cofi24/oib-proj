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
      const payload = req.body as SendPackagingDTO;

      if (!payload.role || typeof payload.amount !== "number") {
        return res.status(400).json({ message: "Invalid payload" });
      }

      await this.storageService.sendPackaging(
        payload,
        this.forwardHeaders(req)
      );

      return res.status(204).send();
    } catch (err: any) {
      return res
        .status((err as any).status ?? 500)
        .json({ message: err.message ?? "Storage error" });
    }
  }

  getRouter(): Router {
    return this.router;
  }
}