import * as DTO from "../DTOs/paymentTransaction.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";
import { validateOwnership } from "../utils/validateOwnership";
import { calculatePaymentSummary } from "../utils/calculatePayment";

export class PaymentTransactionService {
  static async create(
    userId: string,
    dataSafe: DTO.CreatePaymentTransactionDto,
  ) {
    const receiverId = userId;
    const { body } = dataSafe;
    const { amount, paymentMethod, subscriptionId, lessonId } = body;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        payments: true,
      },
    });

    if (!subscription) throw ApiError.NotFound("Subscription");

    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!lesson || lesson.subscriptionId !== subscriptionId) {
        throw ApiError.NotFound("Lesson");
      }
    }

    const { remaining } = calculatePaymentSummary(
      subscription.payments,
      subscription.priceAtBooking,
    );

    if (amount > remaining) throw ApiError.Conflict("OVERPAYMENT");

    const paymentTransaction = await prisma.$transaction(async (tx) => {
      if (
        subscription.status === "PENDING_PAYMENT" &&
        paymentMethod === "CASH"
      ) {
        await tx.subscription.update({
          where: { id: subscriptionId },
          data: { status: "PAID_WAITING_BOOKING" },
        });
      }

      return await tx.paymentTransaction.create({
        data: {
          receiverId,
          clientId: subscription.clientId,
          subscriptionId: subscription.id,
          academyId: subscription.academyId,
          lessonId: lessonId ? lessonId : null,
          status: paymentMethod === "CASH" ? "COMPLETED" : "PENDING",
          amount,
          paymentMethod,
        },
      });
    });

    return paymentTransaction;
  }

  static async getAll(
    userId: string,
    dataSafe: DTO.GetAllPaymentTransactionsDto,
  ) {
    const { query, params } = dataSafe;
    const { academyId } = params;
    const { limit, page } = query;

    await validateOwnership(userId, academyId);

    const where: Prisma.PaymentTransactionWhereInput = { academyId };

    const total = await prisma.paymentTransaction.count({ where });

    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.paymentTransaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        receiver: { select: { id: true, name: true } },
        subscription: { select: { id: true } },
      },
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getDetails(dataSafe: DTO.GetPaymentTransactionDetailsDto) {
    const { id } = dataSafe.params;

    const paymentTransaction = await prisma.paymentTransaction.findUnique({
      where: {
        id: id,
      },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        receiver: { select: { id: true, name: true, phone: true } },
        subscription: { include: { course: true } },
        lesson: true,
        subscriptionCancellations: true,
      },
    });

    if (!paymentTransaction) {
      throw ApiError.NotFound("PaymentTransaction");
    }

    return paymentTransaction;
  }

  static async update(
    userId: string,
    dataSafe: DTO.UpdatePaymentTransactionDto,
  ) {
    const { body, params } = dataSafe;
    const { id, academyId } = params;

    await validateOwnership(userId, academyId);

    const existingTransaction = await prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        subscription: {
          include: { payments: { where: { id: { not: id } } } },
        },
      },
    });

    if (!existingTransaction) {
      throw ApiError.NotFound("PaymentTransaction");
    }

    if (body.amount) {
      const { remaining } = calculatePaymentSummary(
        existingTransaction.subscription.payments,
        existingTransaction.subscription.priceAtBooking,
      );

      if (body.amount > remaining) throw ApiError.Conflict("OVERPAYMENT");
    }

    if (body.status === "COMPLETED") {
      if (existingTransaction.subscription.status === "PENDING_PAYMENT") {
        await prisma.subscription.update({
          where: { id: existingTransaction.subscriptionId },
          data: { status: "PAID_WAITING_BOOKING" },
        });
      }
    }

    const updatedPaymentTransaction = await prisma.paymentTransaction.update({
      where: { id },
      data: body,
    });

    return updatedPaymentTransaction;
  }

  static async delete(
    userId: string,
    dataSafe: DTO.DeletePaymentTransactionDto,
  ) {
    const { id, academyId } = dataSafe.params;

    await validateOwnership(userId, academyId);

    const existingTransaction = await prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        subscription: { include: { payments: { where: { id: { not: id } } } } },
      },
    });

    if (!existingTransaction) {
      throw ApiError.NotFound("PaymentTransaction");
    }

    const { totalPaid } = calculatePaymentSummary(
      existingTransaction.subscription.payments,
      existingTransaction.subscription.priceAtBooking,
    );

    if (totalPaid <= 0) {
      await prisma.subscription.update({
        where: { id: existingTransaction.subscriptionId },
        data: { status: "PENDING_PAYMENT" },
      });
    }
    await prisma.paymentTransaction.delete({
      where: { id },
    });

    return true;
  }
}
