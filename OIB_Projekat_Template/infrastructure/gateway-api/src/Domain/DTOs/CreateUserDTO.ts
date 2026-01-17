import { UserRole } from "../enums/UserRole";
export type CreateUserDTO = { 
    username: string;
     email: string; 
     password: string; 
     role: UserRole; 
     profileImage?: string
 };
