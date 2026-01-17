import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../Domain/enums/UserRole";

export const authorizeSelfOrRoles = (paramIdKey: string, ...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const targetId = Number(req.params[paramIdKey]);
    const isSelf = user.id === targetId;

    if (isSelf || roles.includes(user.role)) return next();
    return res.status(403).json({ message: "Access denied" });
  };
};
