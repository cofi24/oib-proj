import { UserRole } from "../enums/UserRole";

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  profileImage: string;
}