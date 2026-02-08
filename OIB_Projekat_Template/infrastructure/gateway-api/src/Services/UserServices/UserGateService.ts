import axios, { AxiosInstance } from "axios";
import { IUserGateService } from "../../Domain/services/IUserGateService";
import { UserDTO } from "../../Domain/DTOs/UserDTO";
import { CreateUserDTO } from "../../Domain/DTOs/CreateUserDTO";
import { UpdateUserDTO } from "../../Domain/DTOs/UpdateUserDTO";

export class UserGatewayService implements IUserGateService {
  private readonly userClient: AxiosInstance;

  constructor() {
    const userBaseURL = process.env.USER_SERVICE_API;
    const gatewaySecret = process.env.GATEWAY_SECRET;

    if (!userBaseURL) {
      throw new Error("USER_SERVICE_API not defined in .env");
    }

    if (!gatewaySecret) {
      throw new Error("GATEWAY_SECRET not defined in .env");
    }

    this.userClient = axios.create({
      baseURL: userBaseURL,
      headers: { 
        "Content-Type": "application/json",
        "x-gateway-secret": gatewaySecret
      },
      timeout: 10000,
    });

    console.log("✅ UserGatewayService initialized");
    console.log("   User Service:", userBaseURL);
  }

  async getAllUsers(): Promise<UserDTO[]> {
    try {
       
      const response = await this.userClient.get<UserDTO[]>("/users");
      
      return response.data;
    } catch (error) {
      console.error("UserGatewayService: Get all users error:");
      throw new Error("Failed to fetch users");
    }
  }

  async getUserById(id: number): Promise<UserDTO> { 
    try {
     
      const response = await this.userClient.get<UserDTO>(`/users/${id}`);
      
      return response.data;
    } catch (error) {
      console.error("UserGateService: Get user by ID error.");
      throw new Error( `User with ID ${id} not found`);
    }
  }

  async createUser(data: CreateUserDTO, token?: string): Promise<UserDTO> {
    try {
      console.log("UserGateService: Creating new user");
      const response = await this.userClient.post<UserDTO>("/users", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      console.log("UserGateService: User created:", response.data.username);
      return response.data;
    } catch (error) {
      console.error("UserGateService: Create user error.");
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: number, data: UpdateUserDTO, token?: string): Promise<UserDTO> {
    try {
      console.log("UserGatewayService: Updating user", id);
      const response = await this.userClient.put<UserDTO>(`/users/${id}`, data, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      console.log("UserGatewayService: User updated:", response.data.username);
      return response.data;
    } catch (error) {
      console.error("UserGatewayService: Update user error.");
      throw new Error("Failed to update user");
    }
  }
async getCurrentUser(userId: number): Promise<UserDTO> {
  try {
    console.log("UserGatewayService: Fetching current user", userId);
    
    const response = await this.userClient.get<UserDTO>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("UserGatewayService: Get current user error");
    throw new Error("Failed to fetch current user");
  }
}
  async deleteUser(id: number, token?: string): Promise<void> {
    try {
      console.log("UserGatewayService: Deleting user", id);
      await this.userClient.delete(`/users/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      console.log("UserGatewayService: User deleted successfully");
    } catch (error) {
      console.error("UserGatewayService: Delete user error.");
      throw new Error("Failed to delete user");
    }
  }
}