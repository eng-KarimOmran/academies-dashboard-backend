import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/academy.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import { Academy, User } from "../../generated/prisma/client";
import dayjs from "dayjs";
import { getCustomPeriod } from "../utils/getCustomPeriod";
import { omitKeys } from "../utils/omitKeys";
import { USER_SENSITIVE_KEYS } from "../utils/safeKeys";

export const createAcademy = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const { name, address, phone, instaPay, owners, socialMedia } = body;

  const academyExists = await prisma.academy.findFirst({
    where: {
      OR: [{ name }, { phone }],
    },
  });

  if (academyExists)
    throw ApiError.Conflict("اسم الأكادمية او رقم الهاتف مسجل بالفعل");

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: owners.map((owner) => owner.id),
      },
      deletedAt: null,
    },
  });

  if (users.length !== owners.length) throw ApiError.NotFound("احد الملاك");

  const academy = await prisma.academy.create({
    data: {
      name,
      phone,
      address,
      instaPay,
      owners: {
        connect: owners,
      },
      socialMediaPlatforms: {
        create: socialMedia,
      },
    },
    include: {
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: academy,
    message: "تم اضافة الأكادمية بنجاح",
  });
};

export const updateAcademy = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;
  const { name, owners, address, phone, instaPay, socialMedia } = body;

  const data: any = {};

  const academyExists = await prisma.academy.findUnique({
    where: { id , deletedAt:null},
    include: {
      owners: true,
    },
  });

  if (!academyExists) throw ApiError.NotFound("الأكادمية غير موجود");

  if (name && name !== academyExists.name) {
    const nameExists = await prisma.academy.findUnique({ where: { name } });
    if (nameExists) throw ApiError.Conflict("اسم الأكادمية مسجل بالفعل");
    data.name = name;
  }

  if (phone && phone !== academyExists.phone) {
    const phoneExists = await prisma.academy.findUnique({ where: { phone } });
    if (phoneExists) throw ApiError.Conflict("رقم الأكادمية مسجل بالفعل");
    data.phone = phone;
  }

  if (owners && owners.length > 0) {
    const ownerIds = owners.map((o) => o.id).sort();
    const existingOwnerIds = academyExists.owners.map((o) => o.id).sort();
    const ownersChanged = ownerIds.some(
      (id, idx) => id !== existingOwnerIds[idx],
    );
    if (ownersChanged) {
      const users = await prisma.user.findMany({
        where: {
          id: { in: ownerIds },
          deletedAt: null,
        },
      });
      if (users.length !== owners.length) throw ApiError.NotFound("احد الملاك");
      data.owners = owners;
    }
  }

  if (socialMedia && socialMedia.length > 0) data.socialMedia = socialMedia;
  if (address) data.address = address;
  if (instaPay) data.instaPay = instaPay;

  const academyUpdate = await prisma.academy.update({
    where: { id: academyExists.id },
    data,
    include: {
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({
    res,
    data: academyUpdate,
  });
};

export const deleteAcademy = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.DeleteDto;
  const { id } = params;

  const academyExists = await prisma.academy.findUnique({
    where: { id, deletedAt: null },
  });

  if (!academyExists) throw ApiError.NotFound("الأكادمية غير موجود");

  const academy = await prisma.academy.update({
    where: { id },
    data: { deletedAt: dayjs().toDate() },
    include: {
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({ res, data: academy });
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
  const { id } = params;
  const academy = await prisma.academy.findUnique({ where: { id } });
  if (!academy) throw ApiError.NotFound("الأكادمية غير موجود");

  if (!academy.deletedAt) throw ApiError.BadRequest("الأكادمية بالفعل مفعل");

  const restoredAcademy = await prisma.academy.update({
    where: { id },
    data: { deletedAt: null },
    include: {
      socialMediaPlatforms: true,
    },
  });

  return sendSuccess({ res, data: restoredAcademy });
};

export const getDetailsAcademy = async (req: RequestAuth, res: Response) => {
  const userLogin = req.user as User;

  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  const academyDetails = await prisma.academy.findUnique({
    where: { id, deletedAt: null },
    include: {
      owners: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      socialMediaPlatforms: {
        select: {
          id: true,
          platform: true,
          url: true,
        },
      },
    },
  });

  if (!academyDetails) throw ApiError.NotFound("الأكادمية");
  if (!academyDetails.owners.some((owner) => owner.id === userLogin.id))
    throw ApiError.Forbidden();

  return sendSuccess({
    res,
    data: academyDetails,
  });
};