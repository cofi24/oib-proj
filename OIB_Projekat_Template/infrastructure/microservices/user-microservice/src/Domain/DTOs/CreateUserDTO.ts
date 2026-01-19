import { UserRole } from "../enums/UserRole";

export type CreateUserDTO = {
  username: string;
  email: string;
  role: UserRole;
  profileImage?: string;
};
