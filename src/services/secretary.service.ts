import { selectSafeKeys } from "./../utils/safeKeys";
import * as DTO from "../DTOs/secretary.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { Prisma } from "../../generated/prisma/client";
import { PaginatedResponse } from "../types/types";
import { getPaginationParams } from "../utils/Pagination";

export class SecretaryService {
  static async create(dataSafe: DTO.CreateDto) {
    const { body } = dataSafe;
    const { phone, baseSalary, bonusAmount, targetCount } = body;

    const user = await prisma.user.findUnique({
      where: { phone },
      select: {
        ...selectSafeKeys("user"),
        captainProfile: {
          select: selectSafeKeys("captain"),
        },
        secretaryProfile: {
          select: selectSafeKeys("secretary"),
        },
      },
    });

    if (!user) throw ApiError.NotFound("User");
    if (user.secretaryProfile) throw ApiError.Conflict("SecretaryProfile");
    if (user.captainProfile) throw ApiError.Conflict("RoleConflict");

    const secretary = await prisma.$transaction(async (tx) => {
      if (user.role !== "OWNER") {
        await tx.user.update({
          where: { id: user.id },
          data: { role: "SECRETARY" },
        });
      }

      return await tx.secretary.create({
        data: {
          userId: user.id,
          baseSalary,
          bonusAmount,
          targetCount,
        },
        select: selectSafeKeys("secretary"),
      });
    });

    return secretary;
  }

  static async update(dataSafe: DTO.UpdateDto) {
    const { body, params } = dataSafe;
    const { id } = params;
    const { baseSalary, bonusAmount, targetCount} = body;

    const secretaryExists = await prisma.secretary.findUnique({
      where: { id },
    });
    
    if (!secretaryExists) throw ApiError.NotFound("Secretary");

    const updateData: Prisma.SecretaryUpdateInput = {};
    if (baseSalary) updateData.baseSalary = baseSalary;
    if (bonusAmount) updateData.bonusAmount = bonusAmount;
    if (targetCount) updateData.targetCount = targetCount;

    const secretaryUpdate = await prisma.secretary.update({
      where: { id },
      data: updateData,
      select: selectSafeKeys("secretary"),
    });

    return secretaryUpdate;
  }

  static async getAll(dataSafe: DTO.GetAllDto) {
    const { query } = dataSafe;
    const { limit, page } = query;

    const total = await prisma.secretary.count();

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.secretary.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: {
        ...selectSafeKeys("secretary"),
        user: { select: selectSafeKeys("user") },
      },
    });

    const data: PaginatedResponse<any> = {
      items,
      pagination: {
        limit,
        page: safePage,
        total,
        totalPages,
      },
    };

    return data;
  }

  static async getDetails(dataSafe: DTO.GetDetailsDto) {
    const { params } = dataSafe;
    const { id } = params;

    const secretary = await prisma.secretary.findUnique({
      where: { id },
      select: {
        ...selectSafeKeys("secretary"),
        user: { select: selectSafeKeys("user") },
      },
    });

    if (!secretary) throw ApiError.NotFound("Secretary");

    return secretary;
  }

  static async delete(dataSafe: DTO.DeleteDto) {
    const { params } = dataSafe;
    const { id } = params;

    const secretary = await prisma.secretary.findUnique({ where: { id } });
    if (!secretary) throw ApiError.NotFound("Secretary");

    await prisma.$transaction(async (tx) => {
      await tx.secretary.delete({ where: { id } });

      if (secretary.userId) {
        const user = await tx.user.findUnique({
          where: { id: secretary.userId },
        });

        if (user && user.role === "SECRETARY") {
          await tx.user.update({
            where: { id: secretary.userId },
            data: { role: "USER" },
          });
        }
      }
    });

    return true;
  }
}
