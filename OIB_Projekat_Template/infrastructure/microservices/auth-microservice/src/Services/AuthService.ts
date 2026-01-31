import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../Domain/models/User";
import { IAuthService } from "../Domain/services/IAuthService";
import { LoginUserDTO } from "../Domain/DTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../Domain/DTOs/RegistrationUserDTO";
import { AuthResponseType } from "../Domain/types/AuthResponse";
import { UserRole } from "../Domain/enums/UserRole";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { AuditingService } from "./AuditingService";


export class AuthService implements IAuthService {
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS || "10", 10);

  constructor(private userRepository: Repository<User>,
    private auditingService:IAuditingService
  ) {}

  /**
   * Login user
   */
  async login(data: LoginUserDTO): Promise<AuthResponseType> {
    const user = await this.userRepository.findOne({ where: 
      { username: data.username } });
    if (!user || !user.password){
      await this.auditingService.log(
        AuditLogType.WARNING,
        `Failed login attempt for username: ${data.username}`
      );
      return { authenificated: false };
    }
      
      

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches)  {
      await this.auditingService.log(
        AuditLogType.WARNING,
        `Failed login attempt for username: ${data.username}`
      );
      return { authenificated: false };
    }

    await this.auditingService.log(
      AuditLogType.INFO,
      `User logged in: ${user.username}`
    );
    return {
      authenificated: true,
      userData: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * Register new user
   */
  async register(data: RegistrationUserDTO): Promise<AuthResponseType> {
    // Check if username or email already exists
    if (!data.password) {
      await this.auditingService.log(
        AuditLogType.ERROR,
        `Registration failed: No password provided for username: ${data.username}`
      );
      return { authenificated: false };
    }
    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) {
      await this.auditingService.log(
        AuditLogType.ERROR,
        `Registration failed: Username or email already exists: ${data.username}`
      );
      return { authenificated: false };
    }

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    const newUser = this.userRepository.create({
      username: data.username,
      email: data.email,
      role: data.role,
      password: hashedPassword,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      profileImage: data.profileImage ?? null,
    });

    const savedUser = await this.userRepository.save(newUser);
    await this.auditingService.log(
        AuditLogType.INFO,
        `New user registered: ${savedUser.username}`
    );
    return {
      authenificated: true,
      userData: {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role,
      },
    };
  }
}
