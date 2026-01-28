import { UserRole } from "../enums/UserRole";

export interface RegistrationUserDTO {
    username: string;
    role: UserRole;
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
}