import { Request,Response,Router } from "express";
import { IUserGateService } from "../../Domain/services/IUserGateService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import { UserRole } from "../../Domain/enums/UserRole";


export class UserGateController {
  private readonly router: Router;

  constructor(private readonly userService: IUserGateService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
     this.router.get(
    "/users/me",
    authenticate,
    authorize(
      UserRole.ADMIN,
      UserRole.SELLER,
      UserRole.SALES_MANAGER
    ),
    this.getMe.bind(this)
  );
    this.router.get(
      "/users", 
      authenticate, 
      authorize(UserRole.ADMIN), 
      this.getAllUsers.bind(this)
    );
    
    this.router.get(
      "/users/:id", 
      authenticate, 
      authorize(UserRole.ADMIN, UserRole.SELLER, UserRole.SALES_MANAGER), 
      this.getUserById.bind(this)
    );
    this.router.post(
    "/users",
    authenticate,
    authorize(UserRole.ADMIN),
    this.createUser.bind(this)
  );

  this.router.put(
    "/users/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    this.updateUser.bind(this)
  );

  this.router.delete(
    "/users/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    this.deleteUser.bind(this)
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
      const id = parseInt(
        Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
        10
        );
        //izmena za validaciju id-a
      
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
  private async createUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({
      message: (err as Error).message
    });
  }
}

private async getMe(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id; // iz JWT-a (Gateway već zna)
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await this.userService.getCurrentUser(userId);
    res.status(200).json(user);
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Failed to fetch current user" });
  }
}

 private async updateUser(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const user = await this.userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({
      message: (err as Error).message
    });
  }
}

  private async deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    await this.userService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      message: (err as Error).message
    });
  }
}

  public getRouter(): Router {
    return this.router;
  }
}
