import { Request, Response, Router } from "express";
import { IUserGatewayService } from "../../Domain/services/IUserGatewayService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";

export class UserGatewayController {
  private readonly router: Router;

  constructor(private readonly userService: IUserGatewayService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    this.router.get(
      "/users", 
      authenticate, 
      authorize("ADMIN"), 
      this.getAllUsers.bind(this)
    );
    
    this.router.get(
      "/users/:id", 
      authenticate, 
      authorize("ADMIN", "SELLER", "SALES_MANAGER"), 
      this.getUserById.bind(this)
    );
  }
  
  private async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error("Get all users error:", err);
      res.status(500).json({ 
        message: (err as Error).message 
      });
    }
  }

  private async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }
      
      if (req.user?.role !== "ADMIN" && req.user?.id !== id) {
        res.status(403).json({ 
          message: "Forbidden: You can only access your own data" 
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (err) {
      console.error("Get user by ID error:", err);
      res.status(404).json({ 
        message: (err as Error).message 
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
