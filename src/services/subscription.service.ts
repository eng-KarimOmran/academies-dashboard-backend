import { RequestAcademy } from "./../middlewares/verifyAcademy.middleware";
import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../DTOs/subscription.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";
import {
  Academy,
  PaymentTransaction,
  Subscription,
  SubscriptionCancellation,
  User,
} from "../../generated/prisma/client";
import { PaginatedResponse } from "../types/types";
import { getPaginationParams } from "../utils/Pagination";

export const createSubscription = async (
  req: RequestAcademy,
  res: Response,
) => {
  const { body } = req.dataSafe as DTO.CreateDto;

  const { amount, courseId, paymentMethod, phone } = body;

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

  if (!clientExists) throw ApiError.NotFound("رقم العميل");

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      deletedAt: null,
    },
  });

  if (!course) throw ApiError.NotFound("البرنامج");

  const coursePrice = course.priceDiscounted ?? course.priceOriginal;


  if (amount > coursePrice)
    throw ApiError.BadRequest("المبلغ المدفوع أكبر من المبلغ المطلوب للبرنامج");

  const { subscription, payment } = await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.create({
      data: {
        clientId: clientExists.id,
        academyId: academy.id,
        courseId: course.id,
        sessionDurationMinutes: course.sessionDurationMinutes,
        totalSessions: course.totalSessions,
        priceAtBooking: coursePrice,
        status: paymentMethod === "CASH" ? "ACTIVE" : "PENDING",
      },
    });

    const payment = await tx.paymentTransaction.create({
      data: {
        clientId: clientExists.id,
        subscriptionId: subscription.id,
        academyId: academy.id,
        receiverId: user.id,
        status: paymentMethod === "CASH" ? "COMPLETED" : "PENDING",
        paymentMethod,
        amount,
      },
    });

    return { subscription, payment };
  });

  return sendSuccess({
    res,
    statusCode: 201,
    data: { subscription, payment },
    message: "تم تسجيل الأشتراك بنجاح",
  });
};

export const Unsubscribe = async (req: RequestAuth, res: Response) => {
  const { body, params } = req.dataSafe as DTO.UnsubscribeDto;

  const { id } = params;
  const { reason, refundAmount, paymentMethod } = body;

  const user = req.user as User;

  const subscriptionExists = await prisma.subscription.findUnique({
    where: { id },
    include: {
      payments: {
        where: {
          status: "COMPLETED",
        },
      },
    },
  });

  if (!subscriptionExists) throw ApiError.NotFound("الاشتراك غير موجود");

  const totalPaid =
    subscriptionExists.payments.reduce((total, payment) => {
      if (payment.type === "PAYMENT") {
        return total + payment.amount;
      }

      if (payment.type === "REFUND") {
        return total - payment.amount;
      }

      return total;
    }, 0) ?? 0;

  if (totalPaid < refundAmount)
    throw ApiError.BadRequest(
      `لا يمكن استرداد مبلغ اكبر من اجمالي المبلغ المدفوع:${totalPaid}ج.م فقط`,
    );

  const { result } = await prisma.$transaction(async (tx) => {
    const result: {
      payment: PaymentTransaction | null;
      unsubscribe: SubscriptionCancellation | null;
    } = {
      payment: null,
      unsubscribe: null,
    };
    if (refundAmount) {
      const payment = await tx.paymentTransaction.create({
        data: {
          academyId: subscriptionExists.academyId,
          clientId: subscriptionExists.clientId,
          subscriptionId: subscriptionExists.id,
          amount: refundAmount,
          paymentMethod,
          receiverId: user.id,
          type: "REFUND",
          status: "PENDING",
        },
      });
      result.payment = payment;
    }

    const unsubscribe = await tx.subscriptionCancellation.create({
      data: {
        subscriptionId: subscriptionExists.id,
        reason,
        refundAmount,
      },
    });

    result.unsubscribe = unsubscribe;

    await tx.subscription.update({
      where: { id: subscriptionExists.id },
      data: { status: "CANCELLED" },
    });

    return { result };
  });

  return sendSuccess({ res, data: result });
};

export const getAllSubscription = async (req: RequestAuth, res: Response) => {
  const { query } = req.dataSafe as DTO.GetAllDto;
  const academyId = req.params.academyId;

  const { limit, page } = query;

  const total = await prisma.subscription.count({ where: { academyId } });

  const { safePage, skip, totalPages } = getPaginationParams({
    limit,
    page,
    total,
  });

  const items = await prisma.subscription.findMany({
    where: {
      academyId,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip,
  });

  const data: PaginatedResponse<Subscription> = {
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

export const getDetailsSubscription = async (
  req: RequestAuth,
  res: Response,
) => {
  const { params } = req.dataSafe as DTO.GetDetailsDto;
  const { id } = params;

  const subscription = await prisma.subscription.findUnique({
    where: {
      id,
    },
  });

  if (!subscription) throw ApiError.NotFound("الاشتراك");

  return sendSuccess({ res, data: subscription });
};
