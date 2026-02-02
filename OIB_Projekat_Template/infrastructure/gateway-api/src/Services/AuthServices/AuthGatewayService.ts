import axios, { AxiosInstance } from "axios";
import { IAuthGatewayService } from "../../Domain/services/IAuthGatewayService";
import { LoginUserDTO } from "../../Domain/DTOs/AuthDTOs/LoginUserDTO";
import { AuthResponseType } from "../../Domain/types/AuthResponse";
import { RegistrationUserDTO } from "../../Domain/DTOs/AuthDTOs/RegistrationUserDTO";

export class AuthGatewayService implements IAuthGatewayService {
  private readonly authClient: AxiosInstance;

  constructor() {
    const authBaseURL = process.env.AUTH_SERVICE_API;
    const gatewaySecret = process.env.GATEWAY_SECRET;

    if (!authBaseURL) {
      throw new Error("AUTH_SERVICE_API not defined in .env");
    }

    this.authClient = axios.create({
      baseURL: authBaseURL,
      headers: { 
        "Content-Type": "application/json",
        "x-gateway-secret": gatewaySecret
      },
      timeout: 10000,
    });

    console.log("✅ AuthGatewayService initialized:", authBaseURL);
  }

  async login(data: LoginUserDTO): Promise<AuthResponseType> {
    try {
      const response = await this.authClient.post<AuthResponseType>("/auth/login", data);
      return response.data;
    } catch (error) {
      console.error("AuthGatewayService: Login error.");
      
      
      
      return { 
        authenificated: false,
        userData: undefined
      };
    }
  }

  async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
    try {
      const response = await this.authClient.post<AuthResponseType>("/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("AuthGatewayService: Registration error.");
      
      
      
      return { 
        authenificated: false,
        userData: undefined
      };
    }
  }

  getGoogleOAuthStartUrl(): string {
    return `${process.env.AUTH_SERVICE_API}/auth/oauth/google`;
  }

  getGithubOAuthStartUrl(): string {
    return `${process.env.AUTH_SERVICE_API}/auth/oauth/github`;
  }
}