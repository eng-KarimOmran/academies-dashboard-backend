import { NextFunction, Response } from "express";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { RequestAuth } from "./auth.middleware";
import { User } from "../../generated/prisma/client";

export const isAcademyOwner = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User;
  const academyId = req.params.academyId;

  if (!academyId || typeof academyId !== "string") throw ApiError.BadRequest("معرف الأكادمية غير صالح");

  const academy = await prisma.academy.findUnique({
    where: {
      id: academyId,
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

  if (academy.owners.length === 0) throw ApiError.Forbidden();

  return next();
};