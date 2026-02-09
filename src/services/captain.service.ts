import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/captain.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import { Captain } from "../../generated/prisma/client";
import { CaptainUpdateInput } from "../../generated/prisma/models";

export const createCaptain = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const { userId, trainingType, captainLessonPrice } = body;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw ApiError.NotFound("المستخدم");

  if (!user.role.includes("CAPTAIN"))
    throw ApiError.BadRequest(
      "يجب ان يملك المستخدم صلاحية المدرب لأنشاء بروفيل مدرب",
    );

  const captainExists = await prisma.captain.findUnique({ where: { userId } });

  if (captainExists)
    throw ApiError.Conflict("المستخدم لدية ملف كابتن بالفعل");

  const captain = await prisma.captain.create({
    data: {
      userId,
      captainLessonPrice,
      trainingType,
    },
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: captain,
    message: "تم انشاء بروفيل كابتن بنجاح",
  });
};

export const updateCaptain = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;
  const { isActive, trainingType, captainLessonPrice } = body;

  const data:CaptainUpdateInput = {};

  const captainExists = await prisma.captain.findUnique({
    where: { id, deletedAt: null },
  });

  if (!captainExists) throw ApiError.NotFound("ملف الكابتن");

  if (typeof isActive === "boolean") data.isActive = isActive;

  if (trainingType) data.trainingType = trainingType;

  if (captainLessonPrice) data.captainLessonPrice = captainLessonPrice;

  const captainUpdate = await prisma.captain.update({
    where: { id: captainExists.id },
    data,
  });

  return sendSuccess({
    res,
    data: captainUpdate,
  });
};

export const getAllCaptain = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { items, count } = await prisma.$transaction(async (tx) => {
    const items = await tx.captain.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    const count = await tx.captain.count({ where: { deletedAt: null } });
    return { items, count };
  });

  return sendSuccess({
    res,
    data: { items, count, limit, page },
  });
};

export const getDetailsCaptain = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  const captain = await prisma.captain.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!captain) throw ApiError.NotFound("ملف الكابتن");

  return sendSuccess({ res, data: captain });
};