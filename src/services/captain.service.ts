import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { Prisma } from "../../generated/prisma/client";
import { selectSafeKeys } from "../utils/safeKeys";
import { PaginatedResponse } from "../types/types";
import { getPaginationParams } from "../utils/Pagination";
import * as DTO from "../DTOs/captain.dto";
import dayjs from "dayjs";

export class CaptainService {
  static async create(dataSafe: DTO.CreateDto) {
    const { body } = dataSafe;
    const { phone, trainingType, captainLessonPrice } = body;

    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        ...selectSafeKeys("user"),
        captainProfile: { select: selectSafeKeys("captain") },
        secretaryProfile: { select: selectSafeKeys("secretary") },
      },
    });

    if (!user) throw ApiError.NotFound("User");
    if (user.captainProfile) throw ApiError.Conflict("CaptainProfile");
    if (user.secretaryProfile) throw ApiError.Conflict("RoleConflict");

    return prisma.$transaction(async (tx) => {
      if (user.role !== "OWNER") {
        await tx.user.update({
          where: { id: user.id },
          data: { role: "CAPTAIN" },
        });
      }

      return tx.captain.create({
        data: {
          userId: user.id,
          captainLessonPrice,
          trainingType,
        },
        select: selectSafeKeys("captain"),
      });
    });
  }

  static async update(dataSafe: DTO.UpdateDto) {
    const { body, params } = dataSafe;
    const { id } = params;

    const captainExists = await prisma.captain.findUnique({ where: { id } });
    if (!captainExists) throw ApiError.NotFound("Captain");

    const updateData: Prisma.CaptainUpdateInput = {};

    if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;

    if (body.trainingType) updateData.trainingType = body.trainingType;

    if (body.captainLessonPrice)
      updateData.captainLessonPrice = body.captainLessonPrice;

    return prisma.captain.update({
      where: { id },
      data: updateData,
      select: selectSafeKeys("captain"),
    });
  }

  static async getAll(dataSafe: DTO.GetAllDto) {
    const { query } = dataSafe;
    const { limit, page } = query;

    const total = await prisma.captain.count();

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.captain.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: {
        ...selectSafeKeys("captain"),
        user: { select: { id: true, name: true, phone: true } },
      },
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

    const captain = await prisma.captain.findUnique({
      where: { id },
      select: {
        ...selectSafeKeys("captain"),
        user: { select: selectSafeKeys("user") },
      },
    });

    if (!captain) throw ApiError.NotFound("Captain");

    return captain;
  }

  static async delete(dataSafe: DTO.DeleteDto) {
    const { params } = dataSafe;
    const { id } = params;

    const captain = await prisma.captain.findUnique({ where: { id } });
    if (!captain) throw ApiError.NotFound("Captain");

    await prisma.$transaction(async (tx) => {
      await tx.captain.delete({ where: { id } });

      if (captain.userId) {
        const user = await tx.user.findUnique({
          where: { id: captain.userId },
        });

        if (user && user.role !== "OWNER") {
          await tx.user.update({
            where: { id: captain.userId },
            data: { role: "USER" },
          });
        }
      }
    });

    return true;
  }

  static async getActive(dataSafe: DTO.FilterCaptainsDto) {
    const { query } = dataSafe;
    const { type } = query;

    const where: Prisma.CaptainWhereInput = {
      isActive: true,
    };

    if (type) {
      where.trainingType = { in: ["BOTH", type] };
    }

    return prisma.captain.findMany({
      where,
      select: {
        ...selectSafeKeys("captain"),
        user: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  static async getCaptainSchedule(dataSafe: DTO.GetCaptainScheduleDto) {
    const { params, query } = dataSafe;
    const { id } = params;
    const { date } = query;

    const startOfDay = dayjs(date).startOf("day").toDate();
    const endOfDay = dayjs(date).endOf("day").toDate();

    const lessons = await prisma.lesson.findMany({
      where: {
        captainId: id,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        client: { select: { name: true, phone: true } },
        car: { select: { plateNumber: true, modelName: true } },
        area: { select: { name: true } },
      },
    });

    return lessons;
  }
}
