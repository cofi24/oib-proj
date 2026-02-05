import { Request, Response, Router } from "express";
import { IStorageService } from "../../Domain/services/IStorageService";
import { ILogerService } from "../../Domain/services/ILogerService";
import { UserRole } from "../../Domain/enums/UserRole";

export class StorageController {
  private readonly router: Router;

  constructor(
    private readonly storageService: IStorageService,
    private readonly logerService: ILogerService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.post("/send-packaging", this.sendPackaging.bind(this));
  }

  private parseRole(req: Request): UserRole {
    // očekujemo da gateway prosledi u header-u, npr:
    // x-user-role: ADMIN | SALES_MANAGER | SELLER
    const raw = String(req.headers["x-user-role"] ?? "").trim();

    if (raw === UserRole.ADMIN) return UserRole.ADMIN;
    if (raw === UserRole.SALES_MANAGER) return UserRole.SALES_MANAGER;
    if (raw === UserRole.SELLER) return UserRole.SELLER;

    // privremeno default (kasnije ćemo strogo 401/403 kad uvežemo gateway)
    return UserRole.SELLER;
  }

  private async sendPackaging(req: Request, res: Response) {
    try {
      console.log("[StorageController] Headers:", req.headers);
    console.log("[StorageController] Body:", req.body);
      const role = this.parseRole(req);
      const amount = Number(req.body?.amount);

      this.logerService.log(`send-packaging requested: role=${role}, amount=${amount}`);

      const result = await this.storageService.sendPackaging(role, amount);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err?.message ?? "Bad request" });
    }
  }
}
