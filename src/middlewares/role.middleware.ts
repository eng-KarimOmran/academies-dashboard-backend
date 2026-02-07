import { NextFunction, RequestHandler, Response } from "express";
import { Role, User } from "../../generated/prisma/client";
import ApiError from "../utils/ApiError";
import { RequestAuth } from "./auth.middleware";

const checkRole = (roles: Role[]):RequestHandler => {
  return (req: RequestAuth, res: Response, next: NextFunction) => {
    const user = req.user as User;

    const hasRole = roles.some((role) => user.role.includes(role));

    if (!hasRole) {
      throw ApiError.Forbidden();
    }

    next();
  };
};

export default checkRole;
