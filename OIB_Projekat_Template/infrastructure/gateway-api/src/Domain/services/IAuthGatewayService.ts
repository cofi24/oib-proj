import { LoginUserDTO } from "../DTOs/AuthDTOs/LoginUserDTO";
import { RegistrationUserDTO } from "../DTOs/AuthDTOs/RegistrationUserDTO";
import { AuthResponseType } from "../types/AuthResponse";

export interface IAuthGatewayService {
  login(data: LoginUserDTO): Promise<AuthResponseType>;
  register(data: RegistrationUserDTO): Promise<AuthResponseType>;
  getGoogleOAuthStartUrl(): string;
  getGithubOAuthStartUrl(): string;
}