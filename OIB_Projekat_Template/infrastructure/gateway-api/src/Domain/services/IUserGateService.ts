import { UserDTO } from "../DTOs/UserDTO";
import { CreateUserDTO } from "../DTOs/CreateUserDTO";
import { UpdateUserDTO } from "../DTOs/UpdateUserDTO";

export interface IUserGateService {

  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;
  createUser(data: CreateUserDTO): Promise<UserDTO>;
  updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO>;
  deleteUser(id: number): Promise<void>;
  getCurrentUser(userId: number): Promise<UserDTO>;
}   
