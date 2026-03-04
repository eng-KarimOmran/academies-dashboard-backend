import * as DTO from "../DTOs/subscription.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";
import { validateOwnership } from "../utils/validateOwnership";
import { calculatePaymentSummary } from "../utils/calculatePayment";

export class SubscriptionService {
  static async create(userId: string, dataSafe: DTO.CreateSubscriptionDto) {
    const { body, params } = dataSafe;
    const { academyId } = params;
    const { phone, courseId, trainingTypeAtRegistration } = body;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      include: {
        courses: {
          where: { id: courseId },
        },
        clients: {
          where: {
            phone,
          },
          include: {
            subscriptions: { select: { id: true } },
          },
        },
      },
    });

    if (!academy) throw ApiError.NotFound("Academy");

    if (!academy.courses[0]) throw ApiError.NotFound("Course");

    if (!academy.clients[0]) throw ApiError.NotFound("Client");

    const client = academy.clients[0];
    const course = academy.courses[0];

    const subscription = await prisma.subscription.create({
      data: {
        clientId: client.id,
        courseId: course.id,
        academyId: academy.id,
        trainingTypeAtRegistration,
        priceAtBooking: course.priceDiscounted ?? course.priceOriginal,
        sessionDurationMinutes: course.sessionDurationMinutes,
        totalSessions: course.totalSessions,
        createdById: client.subscriptions.length === 0 ? userId : null,
      },
      include: {
        client: { select: { id: true, name: true, phone: true } },
      },
    });

    return subscription;
  }

  static async getAll(userId: string, dataSafe: DTO.GetAllSubscriptionsDto) {
    const { query, params } = dataSafe;
    const { academyId } = params;
    const { limit, page, search } = query;

    await validateOwnership(userId, academyId);

    const where: Prisma.SubscriptionWhereInput = { academyId };

    if (search) {
      where.OR = [
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { phone: { contains: search } } },
      ];
    }

    const total = await prisma.subscription.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.subscription.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        course: { select: { id: true, name: true } },
        cancellation: true,
      },
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getDetails(dataSafe: DTO.GetSubscriptionDetailsDto) {
    const { id, academyId } = dataSafe.params;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      include: {
        subscriptions: {
          where: { id },
          include: {
            client: true,
            course: true,
            lessons: true,
            cancellation: true,
          },
        },
      },
    });

    if (!academy) throw ApiError.NotFound("Academy");
    if (!academy.subscriptions[0]) throw ApiError.NotFound("Subscription");

    return academy.subscriptions[0];
  }

  static async delete(userId: string, dataSafe: DTO.DeleteSubscriptionDto) {
    const { id, academyId } = dataSafe.params;

    await validateOwnership(userId, academyId);

    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw ApiError.NotFound("Subscription");
    }

    await prisma.subscription.delete({
      where: { id },
    });

    return true;
  }

  static async cancel(userId: string, dataSafe: DTO.CancelSubscriptionDto) {
    const { body, params } = dataSafe;
    const { academyId, subscriptionId } = params;
    const { reason, refundAmount, paymentMethod } = body;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        cancellation: true,
        payments: true,
      },
    });

    if (!subscription) {
      throw ApiError.NotFound("Subscription");
    }

    if (subscription.cancellation) {
      throw ApiError.Conflict("SubscriptionAlreadyCancelled");
    }

    const { totalPaid } = calculatePaymentSummary(
      subscription.payments,
      subscription.priceAtBooking,
    );

    if (refundAmount && refundAmount > totalPaid)
      throw ApiError.BadRequest(
        `Cannot refund more than the total amount paid (${totalPaid}).`,
      );

    if (refundAmount && !paymentMethod) {
      throw ApiError.ValidationError("Payment method required");
    }

    const updatedSubscription = await prisma.$transaction(async (tx) => {
      let refundTransactionId: null | string = null;
      if (refundAmount && paymentMethod) {
        const refundTransaction = await tx.paymentTransaction.create({
          data: {
            amount: refundAmount,
            paymentMethod: paymentMethod,
            type: "REFUND",
            status: "COMPLETED",
            clientId: subscription.clientId,
            subscriptionId: subscription.id,
            academyId: academyId,
            receiverId: userId,
          },
        });
        refundTransactionId = refundTransaction.id;
      }

      await tx.subscriptionCancellation.create({
        data: {
          subscriptionId: subscription.id,
          reason: reason,
          refundTransactionId: refundTransactionId ?? null,
        },
      });

      await tx.lesson.updateMany({
        where: { subscriptionId: subscription.id, status: "SCHEDULED" },
        data: { status: "CANCELED" },
      });

      return await tx.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELED",
          lessons: {
            updateMany: {
              where: { status: "SCHEDULED" },
              data: {
                status: "CANCELED",
              },
            },
          },
        },
      });
    });

    return updatedSubscription;
  }
}