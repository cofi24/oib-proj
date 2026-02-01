import { UserRole } from "../enums/UserRole";

export type CreateUserDTO = {
  username: string;
  email: string;
  password?: string;

  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: UserRole;
  
};
