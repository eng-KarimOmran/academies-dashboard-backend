import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/user.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import HashHelper from "../utils/HashHelper";
import sendSuccess from "../utils/successResponse";
import { User } from "../../generated/prisma/client";
import dayjs from "dayjs";
import { omitKeys } from "../utils/omitKeys";
import { USER_SENSITIVE_KEYS } from "../utils/safeKeys";

export const createUser = async (req: RequestAuth, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;
  const { name, phone, password, role } = body;

  const userExists = await prisma.user.findUnique({ where: { phone } });

  if (userExists) throw ApiError.Conflict("رقم الهاتف مسجل بالفعل");

  const hashedPassword = await HashHelper.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      role: role,
      password: hashedPassword,
    },
  });

  const userSafe = omitKeys(user, USER_SENSITIVE_KEYS);

  return sendSuccess({
    res,
    statusCode: 201,
    data: userSafe,
    message: "تم اضافة المستخدم بنجاح",
  });
};

export const updateUser = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const { id } = params;
  const { name, phone, password, role, status } = body;

  const data: Partial<User> = {};

  const userExists = await prisma.user.findUnique({
    where: { id, deletedAt: null },
  });

  if (!userExists) throw ApiError.NotFound("المستخدم غير موجود");

  if (password) {
    data.password = await HashHelper.hash(password);
    data.logoutAt = dayjs().toDate();
  }

  if (phone) {
    const phoneExists = await prisma.user.findUnique({ where: { phone } });
    if (phoneExists) throw ApiError.Conflict("رقم الهاتف مسجل بالفعل");
    data.phone = phone;
    data.logoutAt = dayjs().toDate();
  }

  if (name) data.name = name;
  if (role) data.role = role;
  if (status) data.status = status;

  const userUpdate = await prisma.user.update({
    where: { id: userExists.id },
    data,
  });

  const userSafe = omitKeys(userUpdate, USER_SENSITIVE_KEYS);

  return sendSuccess({
    res,
    data: userSafe,
  });
};

export const deleteUser = async (req: RequestAuth, res: Response) => {
  const { id } = (req.dataSafe as DTO.DeleteDto).params;

  const userExists = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!userExists)
    throw ApiError.NotFound("المستخدم غير موجود أو محذوف بالفعل");

  const now = dayjs().toDate();

  const userDelete = await prisma.user.update({
    where: { id },
    data: {
      deletedAt: now,
      captainProfile: {
        update: {
          where: { userId: id },
          data: { deletedAt: now },
        },
      },
      secretaryProfile: {
        update: {
          where: { userId: id },
          data: { deletedAt: now },
        },
      },
    },
  });

  const userSafe = omitKeys(userDelete, USER_SENSITIVE_KEYS);
  return sendSuccess({ res, data: userSafe });
};

export const getAllDeleted = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { users, count } = await prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: {
        deletedAt: { not: null },
      },
      orderBy: {
        deletedAt: "desc",
      },
      take: limit,
      skip,
    });

    const count = await tx.user.count({ where: { deletedAt: { not: null } } });

    return { users, count };
  });

  const usersSafe = users.map((user) =>
    omitKeys<User>(user, USER_SENSITIVE_KEYS),
  );

  return sendSuccess({ res, data: { items: usersSafe, count, limit, page } });
};

export const getAllUser = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { users, count } = await prisma.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    const count = await tx.user.count({ where: { deletedAt: null } });
    return { users, count };
  });

  const usersSafe = users.map((user) =>
    omitKeys<User>(user, USER_SENSITIVE_KEYS),
  );

  return sendSuccess({ res, data: { items: usersSafe, count, limit, page } });
};

export const restore = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.RestoreDto;
  const { id } = params;
  const userExists = await prisma.user.findUnique({
    where: { id },
  });

  if (!userExists) throw ApiError.NotFound("المستخدم غير موجود");

  if (!userExists.deletedAt) throw ApiError.BadRequest("المستخدم بالفعل مفعل");

  const userRestore = await prisma.user.update({
    where: { id },
    data: {
      deletedAt: null,
      captainProfile: {
        update: {
          where: {
            userId: id,
          },
          data: {
            deletedAt: null,
          },
        },
      },
      secretaryProfile: {
        update: {
          where: {
            userId: id,
          },
          data: {
            deletedAt: null,
          },
        },
      },
    },
  });

  const userSafe = omitKeys(userRestore, USER_SENSITIVE_KEYS);

  return sendSuccess({ res, data: userSafe });
};

export const getDetailsUser = async (req: RequestAuth, res: Response) => {
  const userLogin = req.user as User;

  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  if (!userLogin.role.includes("OWNER") && id !== userLogin.id)
    throw ApiError.Forbidden();

  const user = await prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!user) throw ApiError.NotFound("المستخدم");

  const userSafe = omitKeys<any>(user, USER_SENSITIVE_KEYS);

  return sendSuccess({ res, data: userSafe });
};