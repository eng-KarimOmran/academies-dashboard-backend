import * as DTO from "../DTOs/course.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";
import { validateOwnership } from "../utils/validateOwnership";

export class CourseService {
  static async create(userId: string, dataSafe: DTO.CreateDto) {
    const { body, params } = dataSafe;
    const { academyId } = params;

    await validateOwnership(userId, academyId);

    const {
      name,
      description,
      priceOriginal,
      priceDiscounted,
      totalSessions,
      practicalSessions,
      sessionDurationMinutes,
      trainingDetails,
      featuredReason,
    } = body;

    const courseExists = await prisma.course.findUnique({
      where: {
        academyId_name: { academyId, name },
      },
    });

    if (courseExists) throw ApiError.Conflict("Name");

    const course = await prisma.course.create({
      data: {
        name,
        description,
        priceOriginal,
        priceDiscounted: priceDiscounted ?? priceOriginal,
        totalSessions,
        practicalSessions,
        sessionDurationMinutes,
        featuredReason,
        academyId,
        trainingDetails: trainingDetails ? [...new Set(trainingDetails)] : [],
      },
    });

    return course;
  }

  static async update(userId: string, dataSafe: DTO.UpdateDto) {
    const { body, params } = dataSafe;
    const { id, academyId } = params;

    await validateOwnership(userId, academyId);

    const {
      name,
      description,
      priceOriginal,
      priceDiscounted,
      totalSessions,
      practicalSessions,
      sessionDurationMinutes,
      trainingDetails,
      featuredReason,
      isActive,
    } = body;

    const course = await prisma.course.findUnique({
      where: { academyId_id: { id, academyId } },
    });

    if (!course) throw ApiError.NotFound("Course");

    if (name && name !== course.name) {
      const nameTaken = await prisma.course.findFirst({
        where: { name, academyId },
      });
      if (nameTaken) throw ApiError.Conflict("Name");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        name,
        description,
        priceOriginal,
        priceDiscounted,
        totalSessions,
        practicalSessions,
        sessionDurationMinutes,
        featuredReason,
        isActive,
        trainingDetails: trainingDetails
          ? [...new Set(trainingDetails)]
          : undefined,
      },
    });

    return updatedCourse;
  }

  static async getAll(dataSafe: DTO.GetAllDto) {
    const { query, params } = dataSafe;
    const { academyId } = params;
    const { limit, page, search } = query;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true },
    });
    if (!academy) throw ApiError.NotFound("Academy");

    const where: Prisma.CourseWhereInput = {
      academyId,
    };

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const total = await prisma.course.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getActive(dataSafe: DTO.GetActiveDto) {
    const { academyId } = dataSafe.params;

    const items = await prisma.course.findMany({
      where: { academyId, isActive: true },
      orderBy: { name: "asc" },
    });

    return items;
  }

  static async getDetails(dataSafe: DTO.GetDetailsDto) {
    const { id, academyId } = dataSafe.params;

    const course = await prisma.course.findFirst({
      where: { id, academyId },
    });

    if (!course) throw ApiError.NotFound("Course");

    return course;
  }

  static async delete(userId: string, dataSafe: DTO.DeleteDto) {
    const { id, academyId } = dataSafe.params;

    await validateOwnership(userId, academyId);

    const course = await prisma.course.findFirst({
      where: { id, academyId },
    });

    if (!course) throw ApiError.NotFound("Course");

    await prisma.course.delete({ where: { id } });

    return true;
  }
}
