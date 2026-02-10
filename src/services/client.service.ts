import { RequestAcademy } from "./../middlewares/verifyAcademy.middleware";
import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/client.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import dayjs from "dayjs";
import { ClientUpdateInput } from "../../generated/prisma/models";
import { Academy, User } from "../../generated/prisma/client";

export const createClient = async (req: RequestAcademy, res: Response) => {
  const { body } = req.dataSafe as DTO.CreateDto;

  const { name, amount, courseId, phone, paymentMethod } = body;

  const academy = req.academy as Academy;
  const user = req.user as User;

  const clientExists = await prisma.client.findUnique({
    where: {
      academyId_phone: {
        academyId: academy.id,
        phone,
      },
    },
  });

  if (clientExists) throw ApiError.Conflict("رقم العميل مسجل بالفعل");

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      deletedAt: null,
    },
  });

  if (!course) throw ApiError.NotFound("البرنامج");

  if (amount > course.priceDiscounted) throw ApiError.BadRequest("المبلغ المدفوع أكبر من المبلغ المطلوب للبرنامج");

  const { client, subscription, payment } = await prisma.$transaction(
    async (tx) => {
      const client = await tx.client.create({
        data: { name, phone, academyId: academy.id, registeredById: user.id },
      });

      const subscription = await tx.subscription.create({
        data: {
          clientId: client.id,
          academyId: academy.id,
          courseId: course.id,
          sessionDurationMinutes: course.sessionDurationMinutes,
          totalSessions: course.totalSessions,
          priceAtBooking: course.priceDiscounted,
        },
      });

      const payment = await tx.paymentTransaction.create({
        data: {
          clientId: client.id,
          subscriptionId: subscription.id,
          academyId: academy.id,
          receiverId: user.id,
          status: paymentMethod === "CASH" ? "COMPLETED" : "PENDING",
          paymentMethod,
          amount,
        },
      });
      return { client, subscription, payment };
    },
  );

  return sendSuccess({
    res,
    statusCode: 201,
    data: { client, subscription, payment },
    message: "تم اضافة العميل بنجاح",
  });
};

export const updateClient = async (req: RequestAcademy, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UpdateDto;
  const academy = req.academy as Academy;
  const { id } = params;

  const { name, phone } = body;

  const data: ClientUpdateInput = {};

  const clientExists = await prisma.client.findUnique({
    where: { id, deletedAt: null },
  });

  if (!clientExists) throw ApiError.NotFound("العميل غير موجود");

  if (phone && phone !== clientExists.phone) {
    const client = await prisma.client.findUnique({
      where: {
        academyId_phone: {
          academyId: academy.id,
          phone,
        },
      },
    });

    if (client) throw ApiError.Conflict("رقم العميل مسجل بالفعل");

    data.phone = phone;
  }

  if (name && name !== clientExists.name) data.name = name;

  const clientUpdate = await prisma.client.update({
    where: { id },
    data,
  });

  return sendSuccess({
    res,
    data: clientUpdate,
  });
};

export const deleteClient = async (req: RequestAuth, res: Response) => {
  const { id } = (req.dataSafe as DTO.DeleteDto).params;

  const clientExists = await prisma.client.findFirst({
    where: { id, deletedAt: null },
  });

  if (!clientExists) throw ApiError.NotFound("العميل غير موجود");

  const now = dayjs().toDate();

  const clientDelete = await prisma.client.update({
    where: { id },
    data: { deletedAt: now },
  });

  return sendSuccess({ res, data: clientDelete });
};

export const getAllDeleted = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const academyId = req.params.academyId;

  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { clients, count } = await prisma.$transaction(async (tx) => {
    const clients = await tx.client.findMany({
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

    const count = await tx.client.count({
      where: { deletedAt: { not: null } },
    });

    return { clients, count };
  });

  return sendSuccess({ res, data: { items: clients, count, limit, page } });
};

export const getAllClient = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const academyId = req.params.academyId;

  const { limit, page } = query;
  const skip = (page - 1) * limit;

  const { clients, count } = await prisma.$transaction(async (tx) => {
    const clients = await tx.client.findMany({
      where: {
        deletedAt: null,
        academyId,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
    const count = await tx.client.count({ where: { deletedAt: null } });
    return { clients, count };
  });

  return sendSuccess({ res, data: { items: clients, count, limit, page } });
};

export const restore = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.RestoreDto;
  const { id } = params;

  const clientExists = await prisma.client.findUnique({
    where: { id },
  });

  if (!clientExists) throw ApiError.NotFound("العميل غير موجود");

  if (!clientExists.deletedAt) throw ApiError.BadRequest("العميل بالفعل مفعل");

  const clientRestore = await prisma.client.update({
    where: { id },
    data: { deletedAt: null },
  });

  return sendSuccess({ res, data: clientRestore });
};

export const getDetailsClient = async (req: RequestAuth, res: Response) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  const client = await prisma.client.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!client) throw ApiError.NotFound("العميل");

  return sendSuccess({ res, data: client });
};
