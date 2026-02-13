import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/course.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import dayjs from "dayjs";

import {
  CourseCreateInput,
  CourseUpdateInput,
} from "../../generated/prisma/models";
import { PaginatedResponse } from "../types/types";
import { Course } from "../../generated/prisma/client";
import { getPaginationParams } from "../utils/Pagination";

export const createCourse = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;

  const {
    name,
    description,
    practicalSessions,
    priceDiscounted,
    priceOriginal,
    sessionDurationMinutes,
    totalSessions,
    featuredReason,
    trainingDetails,
  } = body;

  const academyId = req.params.academyId;

  const courseExists = await prisma.course.findUnique({
    where: {
      academyId_name: {
        academyId,
        name,
      },
    },
  });

  if (courseExists) throw ApiError.Conflict("اسم البرنامج مسجل بالفعل");

  const data: CourseCreateInput = {
    name,
    description,
    academy: { connect: { id: academyId } },
    practicalSessions,
    priceDiscounted: priceDiscounted ?? priceOriginal,
    priceOriginal,
    sessionDurationMinutes,
    totalSessions,
    featuredReason: featuredReason ?? null,
    trainingDetails: trainingDetails ? [...new Set(trainingDetails)] : [],
  };

  const course = await prisma.course.create({
    data,
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: course,
    message: "تم اضافة البرنامج بنجاح",
  });
};

export const updateCourse = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;

  const {
    name,
    description,
    practicalSessions,
    priceDiscounted,
    priceOriginal,
    sessionDurationMinutes,
    totalSessions,
    featuredReason,
    trainingDetails,
  } = body;

  const data: CourseUpdateInput = {};

  const courseExists = await prisma.course.findUnique({
    where: { id, deletedAt: null },
  });

  if (!courseExists) throw ApiError.NotFound("البرنامج غير موجود");

  if (name && name !== courseExists.name) {
    const course = await prisma.course.findUnique({
      where: {
        academyId_name: {
          academyId: courseExists.academyId,
          name,
        },
      },
    });

    if (course) throw ApiError.Conflict("اسم البرنامج مسجل بالفعل");

    data.name = name;
  }

  if (description) data.description = description;
  if (practicalSessions) data.practicalSessions = practicalSessions;
  if (priceDiscounted) data.priceDiscounted = priceDiscounted;
  if (priceOriginal) data.priceOriginal = priceOriginal;
  if (sessionDurationMinutes)
    data.sessionDurationMinutes = sessionDurationMinutes;
  if (totalSessions) data.totalSessions = totalSessions;
  if (featuredReason) data.featuredReason = featuredReason;
  if (trainingDetails) data.trainingDetails = [...new Set(trainingDetails)];

  const courseUpdate = await prisma.course.update({
    where: { id },
    data,
  });

  return sendSuccess({
    res,
    data: courseUpdate,
  });
};

export const deleteCourse = async (req: RequestAuth, res: Response) => {
  const { id } = (req.dataSafe as DTO.DeleteDto).params;

  const courseExists = await prisma.course.findFirst({
    where: { id, deletedAt: null },
  });

  if (!courseExists) throw ApiError.NotFound("البرنامج غير موجود");

  const now = dayjs().toDate();

  const courseDelete = await prisma.course.update({
    where: { id },
    data: { deletedAt: now },
  });

  return sendSuccess({ res, data: courseDelete });
};

export const getAllDeleted = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const academyId = req.params.academyId;

  const { limit, page } = query;
  const total = await prisma.course.count({
    where: { deletedAt: { not: null } },
  });
  const { safePage, skip, totalPages } = getPaginationParams({
    limit,
    page,
    total,
  });

  const items = await prisma.course.findMany({
    where: {
      deletedAt: { not: null },
      academyId,
    },
    orderBy: {
      deletedAt: "desc",
    },
    take: limit,
    skip,
  });

  const data: PaginatedResponse<Course> = {
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

export const getAllCourse = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const academyId = req.params.academyId;

  const { limit, page } = query;
  const total = await prisma.course.count({ where: { deletedAt: null } });

  const { safePage, skip, totalPages } = getPaginationParams({
    limit,
    page,
    total,
  });
  const items = await prisma.course.findMany({
    where: {
      deletedAt: null,
      academyId,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const data: PaginatedResponse<Course> = {
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

  const courseExists = await prisma.course.findUnique({
    where: { id },
  });

  if (!courseExists) throw ApiError.NotFound("البرنامج غير موجود");

  if (!courseExists.deletedAt)
    throw ApiError.BadRequest("البرنامج بالفعل مفعل");

  const courseRestore = await prisma.course.update({
    where: { id },
    data: { deletedAt: null },
  });

  return sendSuccess({ res, data: courseRestore });
};

export const getDetailsCourse = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  const course = await prisma.course.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!course) throw ApiError.NotFound("البرنامج");

  return sendSuccess({ res, data: course });
};
