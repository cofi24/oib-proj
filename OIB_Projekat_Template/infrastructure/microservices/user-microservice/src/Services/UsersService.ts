import { Repository } from "typeorm";
import { IUsersService } from "../Domain/services/IUsersService";
import { User } from "../Domain/models/User";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { CreateUserDTO } from "../Domain/DTOs/CreateUserDTO";
import { UpdateUserDTO } from "../Domain/DTOs/UpdateUserDTO";

export class UsersService implements IUsersService {
  constructor(private userRepository: Repository<User>) {}

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepository.find();
    return users.map(u => this.toDTO(u));
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserDTO> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error(`User with ID ${id} not found`);
    return this.toDTO(user);
  }

  async createUser(data: CreateUserDTO): Promise<UserDTO> {
    const user = this.userRepository.create({
      username: data.username,
      email: data.email,
      role: data.role,
      
      profileImage: data.profileImage,
    });

    const saved = await this.userRepository.save(user);
    return this.toDTO(saved);
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) throw new Error(`User with ID ${id} not found`);

  if (data.username !== undefined) user.username = data.username;
  if (data.email !== undefined) user.email = data.email;
  if (data.role !== undefined) user.role = data.role;
  if (data.profileImage !== undefined) user.profileImage = data.profileImage;

  const saved = await this.userRepository.save(user);
  return this.toDTO(saved);
}


  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      throw new Error(`User with ID ${id} not found`);
    }
  }
  /**
   * Convert User entity to UserDTO
   */
  private toDTO(user: User): UserDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage ?? "",
    };
  }

}
