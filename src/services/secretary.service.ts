import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/secretary.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import { SecretaryUpdateInput } from "../../generated/prisma/models";

export const createSecretary = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const { userId, baseSalary, bonus, target } = body;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw ApiError.NotFound("المستخدم");

  if (!user.role.includes("SECRETARY"))
    throw ApiError.BadRequest(
      "يجب ان يملك المستخدم صلاحية سيكرتير لأنشاء ملف سيكرتير",
    );

  const secretaryExists = await prisma.secretary.findUnique({
    where: { userId },
  });

  if (secretaryExists)
    throw ApiError.Conflict("المستخدم لدية ملف سكرتير بالفعل");

  const secretary = await prisma.secretary.create({
    data: {
      userId,
      baseSalary,
      bonus,
      target,
    },
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: secretary,
    message: "تم انشاء بروفيل السكرتير بنجاح",
  });
};

export const updateSecretary = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;
  const { isActive, baseSalary, bonus, target } = body;

  const data: SecretaryUpdateInput = {};

  const secretaryExists = await prisma.secretary.findUnique({
    where: { id, deletedAt: null },
  });

  if (!secretaryExists) throw ApiError.NotFound("ملف السكرتير");

  if (typeof isActive === "boolean") data.isActive = isActive;

  if (baseSalary) data.baseSalary = baseSalary;

  if (bonus) data.bonus = bonus;

  if (target) data.target = target;

  const secretaryUpdate = await prisma.secretary.update({
    where: { id: secretaryExists.id },
    data,
  });

  return sendSuccess({
    res,
    data: secretaryUpdate,
  });
};

export const getAllSecretary = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { items, count } = await prisma.$transaction(async (tx) => {
    const items = await tx.secretary.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    const count = await tx.secretary.count({ where: { deletedAt: null } });
    return { items, count };
  });

  return sendSuccess({
    res,
    data: { items, count, limit, page },
  });
};

export const getDetailsSecretary = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  const secretary = await prisma.secretary.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!secretary) throw ApiError.NotFound("ملف السكرتير");

  return sendSuccess({ res, data: secretary });
};
