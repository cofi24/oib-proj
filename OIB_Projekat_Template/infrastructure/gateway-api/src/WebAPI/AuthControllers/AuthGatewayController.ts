import { Request, Response, Router } from "express";
import axios from "axios";
import { LoginUserDTO } from "../../Domain/DTOs/AuthDTOs/LoginUserDTO";
import { IAuthGatewayService } from "../../Domain/services/IAuthGatewayService";
import { RegistrationUserDTO } from "../../Domain/DTOs/AuthDTOs/RegistrationUserDTO";

export class AuthGatewayController {
  private readonly router: Router;

  constructor(private readonly authService: IAuthGatewayService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    this.router.post("/auth/login", this.login.bind(this));
    this.router.post("/auth/register", this.register.bind(this));
    this.router.get("/auth/oauth/google", this.oauthGoogleStart.bind(this));
    this.router.get("/auth/oauth/github", this.oauthGithubStart.bind(this));
    this.router.get("/auth/oauth/google/callback", this.oauthGoogleCallback.bind(this));
    this.router.get("/auth/oauth/github/callback", this.oauthGithubCallback.bind(this));
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

  private async oauthGoogleStart(_req: Request, res: Response): Promise<void> {
    try {
      const url = this.authService.getGoogleOAuthStartUrl();
      console.log("Gateway: Redirecting to Google OAuth:", url);
      res.redirect(url);
    } catch (err) {
      console.error("OAuth Google start error:", err);
      res.status(500).json({ 
        success: false, 
        message: "Failed to initiate Google OAuth" 
      });
    }
  }

  private async oauthGithubStart(_req: Request, res: Response): Promise<void> {
    try {
      const url = this.authService.getGithubOAuthStartUrl();
      console.log("Gateway: Redirecting to GitHub OAuth:", url);
      res.redirect(url);
    } catch (err) {
      console.error("OAuth GitHub start error:", err);
      res.status(500).json({ 
        success: false, 
        message: "Failed to initiate GitHub OAuth" 
      });
    }
  }

  
  private async oauthGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      const code = String(req.query.code ?? "");
      
      if (!code) {
        console.error("Gateway: Google OAuth callback - missing code");
        res.status(400).json({ 
          success: false, 
          message: "Authorization code missing" 
        });
        return;
      }

      console.log("Gateway: Google OAuth callback received, code:", code.substring(0, 10) + "...");

      const response = await axios.get(
        `${process.env.AUTH_SERVICE_API}/auth/oauth/google/callback`,
        {
          params: { code },
          headers: {
            'x-gateway-secret': process.env.GATEWAY_SECRET
          },
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400
        }
      );

      console.log("Gateway: Auth service response status:", response.status);

      if (response.data && response.data.token) {
        const clientRedirect = process.env.CLIENT_REDIRECT_URL!;
        const url = new URL(clientRedirect);
        url.searchParams.set("token", response.data.token);
        
        console.log("Gateway: Redirecting to client with token");
        res.redirect(url.toString());
        return;
      }

      if (response.status === 302 && response.headers.location) {
        console.log("Gateway: Forwarding Auth service redirect");
        res.redirect(response.headers.location);
        return;
      }

      console.error("Gateway: Unexpected response from Auth service");
      res.status(500).json({ 
        success: false, 
        message: "OAuth authentication failed" 
      });
      
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OAuth callback error";

      console.error("Gateway: OAuth Google callback error:", message);

      res.status(500).json({
        success: false,
        message: "OAuth callback failed",
        error: process.env.NODE_ENV === "development" ? message : undefined
      });
    }

  }

  private async oauthGithubCallback(req: Request, res: Response): Promise<void> {
    try {
      const code = String(req.query.code ?? "");
      const state = String(req.query.state ?? "");
      
      if (!code) {
        console.error("Gateway: GitHub OAuth callback - missing code");
        res.status(400).json({ 
          success: false, 
          message: "Authorization code missing" 
        });
        return;
      }

      console.log("Gateway: GitHub OAuth callback received, code:", code.substring(0, 10) + "...");

      const response = await axios.get(
        `${process.env.AUTH_SERVICE_API}/auth/oauth/github/callback`,
        {
          params: { code, state },
          headers: {
            'x-gateway-secret': process.env.GATEWAY_SECRET
          },
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400
        }
      );

      console.log("Gateway: Auth service response status:", response.status);

      if (response.data && response.data.token) {
        const clientRedirect = process.env.CLIENT_REDIRECT_URL!;
        const url = new URL(clientRedirect);
        url.searchParams.set("token", response.data.token);
        
        console.log("Gateway: Redirecting to client with token");
        res.redirect(url.toString());
        return;
      }

      if (response.status === 302 && response.headers.location) {
        console.log("Gateway: Forwarding Auth service redirect");
        res.redirect(response.headers.location);
        return;
      }

      console.error("Gateway: Unexpected response from Auth service");
      res.status(500).json({ 
        success: false, 
        message: "OAuth authentication failed" 
      });
      
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "OAuth callback error";

      console.error("Gateway: OAuth GitHub callback error:", message);

      res.status(500).json({
        success: false,
        message: "OAuth callback failed",
        error: process.env.NODE_ENV === "development" ? message : undefined
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}