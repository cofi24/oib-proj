import { UserRole } from "../enums/UserRole";

export type UpdateUserDTO = {
  username?: string;
  email?: string;
  role?: UserRole;
  profileImage?: string | null;
};
