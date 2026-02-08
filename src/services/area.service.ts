import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/area.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import dayjs from "dayjs";
import { AreaUpdateInput } from "../../generated/prisma/models";

export const createArea = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const { name, supportType } = body;

  const areaExists = await prisma.area.findUnique({
    where: {
      name,
    },
  });

  if (areaExists) throw ApiError.Conflict("اسم المنظقة مسجل بالفعل");

  const area = await prisma.area.create({
    data: { name, supportType },
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: area,
    message: "تم اضافة المنطقة بنجاح",
  });
};

export const updateArea = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;
  const { name, supportType, isActive } = body;

  const data: AreaUpdateInput = {};

  const areaExists = await prisma.area.findUnique({
    where: { id, deletedAt: null },
  });

  if (!areaExists) throw ApiError.NotFound("المنطقة غير موجود");

  if (name && name !== areaExists.name) {
    const nameExists = await prisma.area.findUnique({ where: { name } });
    if (nameExists) throw ApiError.Conflict("اسم المنطقة مسجل بالفعل");
    data.name = name;
  }

  if (supportType) data.supportType = supportType;
  if (typeof isActive === "boolean") data.isActive = isActive;

  const areaUpdate = await prisma.area.update({
    where: { id: areaExists.id },
    data,
  });

  return sendSuccess({
    res,
    data: areaUpdate,
  });
};

export const deleteArea = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.DeleteDto;
  const { id } = params;

  const areaExists = await prisma.area.findUnique({
    where: { id, deletedAt: null },
  });

  if (!areaExists) throw ApiError.NotFound("المنطقة غير موجود");

  const area = await prisma.area.update({
    where: { id },
    data: { deletedAt: dayjs().toDate() },
  });

  return sendSuccess({ res, data: area });
};

export const getAllDeleted = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { items, count } = await prisma.$transaction(async (tx) => {
    const items = await tx.area.findMany({
      where: {
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
      },
      take: limit,
      skip,
    });
    const count = await tx.area.count({
      where: {
        deletedAt: { not: null },
      },
    });
    return { count, items };
  });

  return sendSuccess({ res, data: { items, limit, page, count } });
};

export const getAllArea = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { items, count } = await prisma.$transaction(async (tx) => {
    const items = await tx.area.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    const count = await tx.area.count({ where: { deletedAt: null } });
    return { items, count };
  });

  return sendSuccess({
    res,
    data: { items, count, limit, page },
  });
};

export const restore = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.RestoreDto;
  const { id } = params;
  const area = await prisma.area.findUnique({ where: { id } });
  if (!area) throw ApiError.NotFound("المنطقة غير موجود");

  if (!area.deletedAt) throw ApiError.BadRequest("المنطقة بالفعل مفعل");

  const restoredArea = await prisma.area.update({
    where: { id },
    data: { deletedAt: null },
  });

  return sendSuccess({ res, data: restoredArea });
};

export const getDetailsArea = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;
  const area = await prisma.area.findUnique({ where: { id, deletedAt: null } });
  if (!area) throw ApiError.NotFound("المنطقة");
  return sendSuccess({ res, data: area });
};
