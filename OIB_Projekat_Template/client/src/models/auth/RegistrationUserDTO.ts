import { UserRole } from "../../enums/UserRole";

export interface RegistrationUserDTO {
    username: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    profileImage: string;
}