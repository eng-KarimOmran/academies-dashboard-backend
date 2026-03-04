import { NextFunction, RequestHandler, Response } from "express";
import { Role, User } from "../../generated/prisma/client";
import ApiError from "../utils/ApiError";
import { RequestAuth } from "./auth.middleware";

const checkRole = (roles: Role[]): RequestHandler => {
  return (req: RequestAuth, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!roles.includes(user.role)) {
      throw ApiError.Forbidden();
    }

    next();
  };
};

export default checkRole;
