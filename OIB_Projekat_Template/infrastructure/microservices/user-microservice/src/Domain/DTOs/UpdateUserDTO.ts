import { UserRole } from "../enums/UserRole";

export type UpdateUserDTO = {
  username?: string;
  email?: string;
  role?: UserRole;

  firstName?: string;
  lastName?: string;
  profileImage?: string | null;
};
