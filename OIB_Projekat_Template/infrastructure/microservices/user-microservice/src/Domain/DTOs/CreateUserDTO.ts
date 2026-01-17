import { UserRole } from "../enums/UserRole";

export type CreateUserDTO = {
  username: string;
  email: string;
  role: UserRole;

  // opciono – zavisi od projekta
  firstName?: string;
  lastName?: string;
  profileImage?: string;
};
