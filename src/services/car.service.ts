import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/car.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import dayjs from "dayjs";
import { CarCreateInput, CarUpdateInput } from "../../generated/prisma/models";
import { PaginatedResponse } from "../types/types";
import { Car } from "../../generated/prisma/client";
import { getPaginationParams } from "../utils/Pagination";

export const createCar = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const {
    gearType,
    ownerType,
    plateNumber,
    captainId,
    carSessionPrice,
    modelName,
  } = body;

  const carExists = await prisma.car.findUnique({
    where: {
      plateNumber,
    },
  });

  if (carExists) throw ApiError.Conflict("رقم السيارة مسجل بالفعل");

  const data: CarCreateInput = { gearType, ownerType, plateNumber, modelName };

  if (captainId) {
    const captain = await prisma.captain.findUnique({
      where: {
        id: captainId,
      },
    });
    if (!captain) throw ApiError.NotFound("ملف الكابتن");
    data.captain = {
      connect: {
        id: captain.id,
      },
    };
  }

  if (carSessionPrice) data.carSessionPrice = carSessionPrice;

  const car = await prisma.car.create({
    data,
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: car,
    message: "تم اضافة السيارة بنجاح",
  });
};

export const updateCar = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;

  const {
    captainId,
    carSessionPrice,
    gearType,
    ownerType,
    plateNumber,
    isActive,
    modelName,
  } = body;

  const data: CarUpdateInput = {};

  const carExists = await prisma.car.findUnique({
    where: { id, deletedAt: null },
  });

  if (!carExists) throw ApiError.NotFound("السيارة غير موجود");

  if (plateNumber && plateNumber !== carExists.plateNumber) {
    const plateNumberExists = await prisma.car.findUnique({
      where: { plateNumber, deletedAt: null },
    });
    if (plateNumberExists) throw ApiError.Conflict("رقم السيارة مسجل بالفعل");
    data.plateNumber = plateNumber;
  }

  if (gearType) data.gearType = gearType;

  if (typeof isActive === "boolean") data.isActive = isActive;

  if (ownerType) data.ownerType = ownerType;

  if (carSessionPrice) data.carSessionPrice = carSessionPrice;

  if (captainId) {
    const captain = await prisma.captain.findUnique({
      where: {
        id: captainId,
        deletedAt: null,
      },
    });
    if (!captain) throw ApiError.NotFound("ملف الكابتن");
    data.captain = {
      connect: {
        id: captain.id,
      },
    };
  }

  if (modelName) data.modelName = modelName;

  const carUpdate = await prisma.car.update({
    where: { id: carExists.id },
    data,
  });

  return sendSuccess({
    res,
    data: carUpdate,
  });
};

export const deleteCar = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.DeleteDto;
  const { id } = params;

  const carExists = await prisma.car.findUnique({
    where: { id, deletedAt: null },
  });

  if (!carExists) throw ApiError.NotFound("السيارة غير موجود");

  const car = await prisma.car.update({
    where: { id },
    data: { deletedAt: dayjs().toDate() },
  });

  return sendSuccess({ res, data: car });
};

export const getAllDeleted = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;

  const total = await prisma.car.count({
    where: {
      deletedAt: { not: null },
    },
  });

  const { safePage, skip, totalPages } = getPaginationParams({
    limit,
    page,
    total,
  });

  const items = await prisma.car.findMany({
    where: {
      deletedAt: { not: null },
    },
    orderBy: {
      deletedAt: "desc",
    },
    take: limit,
    skip,
  });

  const data: PaginatedResponse<Car> = {
    items,
    pagination: {
      limit,
      page: safePage,
      total,
      totalPages,
    },
  };

  return sendSuccess({ res, data });
};

export const getAllCar = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const total = await prisma.car.count({ where: { deletedAt: null } });

  const { safePage, skip, totalPages } = getPaginationParams({
    limit,
    page,
    total,
  });

  const items = await prisma.car.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const data: PaginatedResponse<Car> = {
    items,
    pagination: {
      limit,
      page: safePage,
      total,
      totalPages,
    },
  };

  return sendSuccess({ res, data });
};

export const restore = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.RestoreDto;
  const { id } = params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) throw ApiError.NotFound("السيارة غير موجود");

  if (!car.deletedAt) throw ApiError.BadRequest("السيارة بالفعل مفعل");

  const restoredCar = await prisma.car.update({
    where: { id },
    data: { deletedAt: null },
  });

  return sendSuccess({ res, data: restoredCar });
};

export const getDetailsCar = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;
  const car = await prisma.car.findUnique({ where: { id, deletedAt: null } });
  if (!car) throw ApiError.NotFound("السيارة");
  return sendSuccess({ res, data: car });
};
