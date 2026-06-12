import { RoleType } from "@/generated/prisma/enums";
import { JwtPayload } from "@/lib/jwt";
import { NextFunction, Request, Response } from "express";

type AuthenticatedRequest = Request & { user?: JwtPayload };

export const permittedRole = (roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Authentication required",
      });
    }

    if (!roles.includes(authReq.user.role as RoleType)) {
      return res.status(403).json({
        code: 403,
        status: "error",
        message: "Forbidden: You do not have the required role",
      });
    }

    next();
  };
};
