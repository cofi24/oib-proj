import { Request,Response,Router } from "express";
import axios from "axios";
import { LoginUserDTO } from "../../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../../Domain/DTOs/RegistrationUserDTO";
import { IAuthGateService } from "../../Domain/services/IAuthGateService";

export class AuthGateController {
  private readonly router: Router;

  constructor(private readonly authService: IAuthGateService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    this.router.post("/auth/login", this.login.bind(this));
    this.router.post("/auth/register", this.register.bind(this));
   
  }
  
  private async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginUserDTO = req.body;
      const result = await this.authService.login(data);
      res.status(200).json(result);
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ 
        success: false, 
        message: (err as Error).message 
      });
    }
  }

  private async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegistrationUserDTO = req.body;
      const result = await this.authService.register(data);
      res.status(200).json(result);
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ 
        success: false, 
        message: (err as Error).message 
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}