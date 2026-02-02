import { UserDTO } from "../DTOs/AuthDTOs/UserDTO";
import { CreateUserDTO } from "../DTOs/CreateUserDTO";
import { UpdateUserDTO } from "../DTOs/UpdateUserDTO";

export interface IUserGatewayService {
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;
  createUser(data: CreateUserDTO, token?: string): Promise<UserDTO>;
  updateUser(id: number, data: UpdateUserDTO, token?: string): Promise<UserDTO>;
  deleteUser(id: number, token?: string): Promise<void>;
}