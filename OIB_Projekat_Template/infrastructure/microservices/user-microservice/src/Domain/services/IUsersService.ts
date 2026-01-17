import { CreateUserDTO } from "../DTOs/CreateUserDTO";
import { UpdateUserDTO } from "../DTOs/UpdateUserDTO";
import { UserDTO } from "../DTOs/UserDTO";

export interface IUsersService {
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;

  createUser(data: CreateUserDTO): Promise<UserDTO>;
  updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO>;
  deleteUser(id: number): Promise<void>;
}
