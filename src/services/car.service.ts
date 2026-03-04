import { selectSafeKeys } from "./../utils/safeKeys";
import * as DTO from "../DTOs/car.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";
import { PaginatedResponse } from "../types/types";

export class CarService {
  static async create(dataSafe: DTO.CreateDto) {
    const { body } = dataSafe;
    const { plateNumber, modelName, gearType, carSessionPrice } = body;

    const carExists = await prisma.car.findUnique({ where: { plateNumber } });
    if (carExists) throw ApiError.Conflict("LicensePlate");

    const car = await prisma.car.create({
      data: {
        plateNumber,
        modelName,
        gearType,
        carSessionPrice,
      },
      select: {
        ...selectSafeKeys("car"),
      },
    });

    return car;
  }

  static async update(dataSafe: DTO.UpdateDto) {
    const { body, params } = dataSafe;
    const { id } = params;
    const { plateNumber, ...otherData } = body;

    const carExists = await prisma.car.findUnique({ where: { id } });
    if (!carExists) throw ApiError.NotFound("Car");

    if (plateNumber && plateNumber !== carExists.plateNumber) {
      const plateTaken = await prisma.car.findUnique({
        where: { plateNumber },
      });
      if (plateTaken) throw ApiError.Conflict("LicensePlate");
    }

    const carUpdate = await prisma.car.update({
      where: { id },
      data: {
        ...otherData,
        plateNumber,
      },
      select: {
        ...selectSafeKeys("car"),
      },
    });

    return carUpdate;
  }

  static async getAll(dataSafe: DTO.GetAllDto) {
    const { query } = dataSafe;
    const { limit, page, search } = query;

    const where: Prisma.CarWhereInput = search
      ? {
          OR: [
            { plateNumber: { contains: search, mode: "insensitive" } },
            { modelName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const total = await prisma.car.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.car.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    const data: PaginatedResponse<any> = {
      items,
      pagination: { limit, page: safePage, total, totalPages },
    };

    return data;
  }

  static async getDetails(dataSafe: DTO.GetDetailsDto) {
    const { params } = dataSafe;
    const { id } = params;

    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) throw ApiError.NotFound("Car");

    return car;
  }

  static async delete(dataSafe: DTO.DeleteDto) {
    const { params } = dataSafe;
    const { id } = params;

    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) throw ApiError.NotFound("Car");

    await prisma.car.delete({ where: { id } });

    return true;
  }

  static async getActiveCars(dataSafe: DTO.FilterByTypeDto) {
    const { query } = dataSafe;
    const { type } = query;

    const where: Prisma.CarWhereInput = {
      isActive: true,
    };

    if (type) {
      where.gearType = type;
    }

    const cars = await prisma.car.findMany({
      where,
      select: selectSafeKeys("car"),
    });

    return cars;
  }
}
