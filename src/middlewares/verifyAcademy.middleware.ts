import { NextFunction, RequestHandler, Response } from "express";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { RequestAuth } from "./auth.middleware";
import { Academy, User } from "../../generated/prisma/client";

export interface RequestAcademy extends RequestAuth {
  academy?: Academy;
}

export const verifyAcademy = (
  checkOwnership: boolean = true,
): RequestHandler => {
  return async (req: RequestAcademy, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const academyId = req.params.academyId;

    if (!academyId || typeof academyId !== "string") throw ApiError.BadRequest("معرف الأكادمية غير صالح");

    const academy = await prisma.academy.findUnique({
      where: {
        id: academyId,
        deletedAt: null,
      },
      include: {
        owners: {
          where: {
            id: user.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!academy) throw ApiError.NotFound("الأكادمية");

    if (academy.owners.length === 0 && checkOwnership)
      throw ApiError.Forbidden();

    req.academy = academy;
    return next();
  };
};