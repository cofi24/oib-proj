import { UserRole } from "../enums/UserRole";

export type UpdateUserDTO = {
   email?: string;
  password?: string;

  firstName?: string;
  lastName?: string;

  profileImage?: string;

  role?: UserRole;
};
