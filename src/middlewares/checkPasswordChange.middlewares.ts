import { NextFunction, RequestHandler, Response } from "express";
import { RequestAuth } from "./auth.middleware";
import { User } from "../../generated/prisma/client";
import ApiError from "../utils/ApiError";

export const checkPasswordChange: RequestHandler = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User;
  if (!user.isPasswordChanged) {
    throw ApiError.BadRequest(
      "يجب عليك تغيير كلمة المرور الافتراضية أولاً قبل استخدام النظام",
    );
  }
  next();
};
