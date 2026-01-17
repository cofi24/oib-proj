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
      firstName: data.firstName,
      lastName: data.lastName,
      profileImage: data.profileImage,
    });

    const saved = await this.userRepository.save(user);
    return this.toDTO(saved);
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error(`User with ID ${id} not found`);

    Object.assign(user, data);
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
