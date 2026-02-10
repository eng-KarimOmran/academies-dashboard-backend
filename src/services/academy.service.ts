import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/academy.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import { Academy, User } from "../../generated/prisma/client";
import dayjs from "dayjs";
import { AcademyUpdateInput } from "../../generated/prisma/models";
import { RequestAcademy } from "../middlewares/verifyAcademy.middleware";

export const createAcademy = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const { name, address, phone, instaPay, owners, socialMedia } = body;

  const academyExists = await prisma.academy.findFirst({
    where: {
      OR: [{ name }, { phone }],
    },
  });

  if (academyExists)
    throw ApiError.Conflict("اسم الأكاديمية أو رقم الهاتف مسجل بالفعل");

  const uniqueOwnerPhones = [...new Set(owners.map((owner) => owner.phone))];

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      phone: {
        in: uniqueOwnerPhones,
      },
    },
  });

  if (users.length !== uniqueOwnerPhones.length)
    throw ApiError.NotFound("أحد الملاك");

  const academy = await prisma.academy.create({
    data: {
      name,
      phone,
      address,
      instaPay,
      owners: {
        connect: users.map((user) => ({ id: user.id })),
      },
      socialMediaPlatforms: {
        create: socialMedia ?? [],
      },
    },
    include: {
      socialMediaPlatforms: true,
      owners: { select: { id: true, name: true, phone: true } },
    },
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: academy,
    message: "تم إضافة الأكاديمية بنجاح",
  });
};

export const updateAcademy = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { academyId } = params;
  const { name, owners, address, phone, instaPay, socialMedia } = body;

  const data: AcademyUpdateInput = {};

  const academyExists = await prisma.academy.findUnique({
    where: { id: academyId, deletedAt: null },
    include: { owners: true },
  });

  if (!academyExists) throw ApiError.NotFound("الأكاديمية غير موجودة");

  if (name && name !== academyExists.name) {
    const nameExists = await prisma.academy.findUnique({ where: { name } });
    if (nameExists) throw ApiError.Conflict("اسم الأكاديمية مسجل بالفعل");
    data.name = name;
  }

  if (phone && phone !== academyExists.phone) {
    const phoneExists = await prisma.academy.findUnique({ where: { phone } });
    if (phoneExists) throw ApiError.Conflict("رقم الأكاديمية مسجل بالفعل");
    data.phone = phone;
  }

  if (owners) {
    const uniqueOwnerPhones = [...new Set(owners.map((o) => o.phone))];

    const users = await prisma.user.findMany({
      where: { phone: { in: uniqueOwnerPhones }, deletedAt: null },
    });

    if (users.length !== uniqueOwnerPhones.length)
      throw ApiError.NotFound("أحد الملاك");

    data.owners = { set: users.map((user) => ({ id: user.id })) };
  }

  if (socialMedia) {
    data.socialMediaPlatforms = {
      deleteMany: {},
      create: socialMedia.map((sm) => ({
        platform: sm.platform,
        url: sm.url,
      })),
    };
  }

  if (address) data.address = address;
  if (instaPay) data.instaPay = instaPay;

  const academyUpdate = await prisma.academy.update({
    where: { id: academyExists.id },
    data,
    include: {
      socialMediaPlatforms: true,
      owners: { select: { id: true, name: true, phone: true } },
    },
  });

  return sendSuccess({
    res,
    data: academyUpdate,
    message: "تم تحديث بيانات الأكاديمية",
  });
};

export const deleteAcademy = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.DeleteDto;
  const { academyId } = params;

  const academyExists = await prisma.academy.findUnique({
    where: { id: academyId, deletedAt: null },
  });

  if (!academyExists) throw ApiError.NotFound("الأكاديمية غير موجودة");

  const academy = await prisma.academy.update({
    where: { id: academyId },
    data: { deletedAt: dayjs().toDate() },
    include: {
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({ res, data: academy, message: "تم حذف الأكاديمية" });
};

export const getAllDeleted = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { items, count } = await prisma.$transaction(async (tx) => {
    const items = await tx.academy.findMany({
      where: {
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
      },
      include: {
        socialMediaPlatforms: true,
      },
      take: limit,
      skip,
    });
    const count = await tx.academy.count({
      where: {
        deletedAt: { not: null },
      },
    });
    return { count, items };
  });

  return sendSuccess({ res, data: { items, limit, page, count } });
};

export const getAllAcademy = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { items, count } = await prisma.$transaction(async (tx) => {
    const items = await tx.academy.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        socialMediaPlatforms: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    const count = await tx.academy.count({ where: { deletedAt: null } });
    return { items, count };
  });

  return sendSuccess({
    res,
    data: { items, count, limit, page },
  });
};

export const restore = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.RestoreDto;
  const { academyId } = params;

  const academy = await prisma.academy.findUnique({
    where: {
      id: academyId,
    },
  });

  if (!academy) throw ApiError.NotFound("الأكادمية");
  
  if (!academy.deletedAt) throw ApiError.BadRequest("الأكاديمية مفعلة بالفعل");

  const restoredAcademy = await prisma.academy.update({
    where: { id: academy.id },
    data: { deletedAt: null },
    include: {
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({
    res,
    data: restoredAcademy,
    message: "تم استعادة الأكاديمية",
  });
};

export const getDetailsAcademy = async (req: RequestAcademy, res: Response) => {
  const academy = req.academy as Academy;

  const academyDetails = await prisma.academy.findUnique({
    where: { id: academy.id },
    include: {
      owners: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({
    res,
    data: academyDetails,
  });
};
