import { UserRole } from "../../enums/UserRole";
export type CreateUserDTO = { 
    username: string;
     email: string; 
     password: string; 
     role: UserRole; 
     firstName?: string;
     lastName?: string;
     profileImage?: string
 };
