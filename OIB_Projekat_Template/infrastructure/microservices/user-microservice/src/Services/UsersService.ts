import { Repository } from "typeorm";
import { IUsersService } from "../Domain/services/IUsersService";
import { User } from "../Domain/models/User";
import { UserDTO } from "../Domain/DTOs/UserDTO";
import { CreateUserDTO } from "../Domain/DTOs/CreateUserDTO";
import { UpdateUserDTO } from "../Domain/DTOs/UpdateUserDTO";
import bcrypt from "bcryptjs";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";

export class UsersService implements IUsersService {
  private readonly saltRounds = 10;

  constructor(private userRepository: Repository<User>,
    private auditingService:IAuditingService
  ) {}

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

    try {
      const existing = await this.userRepository.findOne({
         where: [{ username: data.username }, { email: data.email }],
    });

    if (existing) {
      throw new Error("Username or email already exists");
    }

    const hashedPassword = data.password
      ? await bcrypt.hash(data.password, this.saltRounds)
      : null;

    const user = this.userRepository.create({
      username: data.username,
      email: data.email,
      role: data.role,
      password: hashedPassword,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      profileImage: data.profileImage ?? null,
      
    });

    const saved = await this.userRepository.save(user);
    await this.auditingService.log(
      AuditLogType.INFO,
      `User created: ${saved.username} (id=${saved.id})`
    );
     
    return this.toDTO(saved);
  }catch (error) {
    
    throw error;
  }
}


  async updateUser(id: number, data: UpdateUserDTO): Promise<UserDTO> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) throw new Error(`User with ID ${id} not found`);

  
  if (data.email !== undefined) user.email = data.email;
  if (data.firstName !== undefined) user.firstName = data.firstName;
  if (data.lastName !== undefined) user.lastName = data.lastName;
  if (data.role !== undefined) user.role = data.role;
  if (data.profileImage !== undefined) user.profileImage = data.profileImage;
  if (data.password) {
        user.password = await bcrypt.hash(data.password, this.saltRounds);
       }
  const saved = await this.userRepository.save(user);
  await this.auditingService.log(
      AuditLogType.INFO,
      `User updated: id=${saved.id}`
    );
  return this.toDTO(saved);
}


  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
     await this.auditingService.log(
      AuditLogType.INFO,
      `User deleted: id=${id}`
    );
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
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImage: user.profileImage ?? "",
    };
  }

}
