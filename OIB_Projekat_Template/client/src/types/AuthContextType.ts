import { AuthTokenClaimsType } from "./AuthTokenClaimsType";
import { UserDTO } from "../models/users/UserDTO";
export type AuthContextType = {
    user: AuthTokenClaimsType | null;
    me: UserDTO | null;  
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}