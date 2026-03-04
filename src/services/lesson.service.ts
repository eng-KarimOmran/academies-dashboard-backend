import * as DTO from "../DTOs/lesson.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import { getPaginationParams } from "../utils/Pagination";
import { Prisma } from "../../generated/prisma/client";
import { validateOwnership } from "../utils/validateOwnership";
import dayjs from "dayjs";
import { calculatePaymentSummary } from "../utils/calculatePayment";

export class LessonService {
  static async create(dataSafe: DTO.CreateLessonDto) {
    const { body, params } = dataSafe;
    const { academyId } = params;

    const {
      startTime,
      transmission,
      captainId,
      carId,
      areaId,
      subscriptionId,
      expectedAmount,
    } = body;

    const [academy, captain, car, subscription] = await Promise.all([
      prisma.academy.findUnique({ where: { id: academyId } }),
      prisma.captain.findUnique({ where: { id: captainId } }),
      prisma.car.findUnique({ where: { id: carId } }),
      prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
          lessons: true,
          payments: true,
          cancellation: true,
          course: true,
        },
      }),
    ]);

    if (!academy) throw ApiError.NotFound("Academy");
    if (!captain) throw ApiError.NotFound("Captain");
    if (!car) throw ApiError.NotFound("Car");
    if (!subscription) throw ApiError.NotFound("Subscription");

    const { status, remaining } = calculatePaymentSummary(
      subscription.payments,
      subscription.priceAtBooking,
    );

    if (remaining < expectedAmount) throw ApiError.Conflict("OVERPAYMENT");

    switch (subscription.status) {
      case "PENDING_PAYMENT":
        throw ApiError.BadRequest(
          "Cannot schedule a lesson because no payment has been made for the subscription.",
        );

      case "PAUSED":
        throw ApiError.BadRequest(
          "Cannot schedule a lesson for a paused subscription.",
        );

      case "POSTPONED":
        throw ApiError.BadRequest(
          "Cannot schedule a lesson for a postponed subscription.",
        );

      case "COMPLETED":
        throw ApiError.BadRequest(
          "Cannot schedule a lesson for an expired subscription.",
        );

      case "CANCELED":
        throw ApiError.BadRequest(
          "Cannot schedule a lesson for a canceled subscription.",
        );
    }

    const lessonsCount = subscription.lessons.filter(
      (l) => l.status !== "CANCELED",
    ).length;

    if (lessonsCount >= subscription.totalSessions) {
      throw ApiError.BadRequest(
        "Cannot schedule a lesson because the subscription has reached its total sessions limit.",
      );
    }

    const halfSessions = Math.ceil(subscription.totalSessions * 0.5);
    if (lessonsCount >= halfSessions && status !== "PAID") {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "PAUSED" },
      });
      throw ApiError.BadRequest(
        "Cannot schedule more than half of the course sessions until the subscription is fully paid.",
      );
    }

    const lesson = await prisma.$transaction(async (tx) => {
      const lessonStartTime = dayjs(startTime).toDate();
      const lessonEndTime = dayjs(startTime)
        .add(subscription.course.sessionDurationMinutes, "minute")
        .toDate();

      const overlappingLesson = await tx.lesson.findFirst({
        where: {
          status: "SCHEDULED",
          OR: [
            { captainId: captainId },
            { carId: carId },
            { clientId: subscription.clientId },
          ],
          startTime: { lt: lessonEndTime },
          endTime: { gt: lessonStartTime },
        },
      });

      if (overlappingLesson) {
        if (overlappingLesson.captainId === captainId)
          throw ApiError.Conflict("CaptainTimeConflict");

        if (overlappingLesson.carId === carId)
          throw ApiError.Conflict("CarTimeConflict");

        if (overlappingLesson.clientId === subscription.clientId)
          throw ApiError.Conflict("ClientTimeConflict");
      }

      if (subscription.status === "PAID_WAITING_BOOKING") {
        await tx.subscription.update({
          where: { id: subscription.id },
          data: { status: "BOOKED_NOT_STARTED" },
        });
      }

      return await tx.lesson.create({
        data: {
          academyId,
          clientId: subscription.clientId,
          subscriptionId,
          captainId,
          carId,
          areaId,
          transmission,
          startTime: lessonStartTime,
          endTime: lessonEndTime,
          expectedAmount: expectedAmount ?? null,
          carSessionPrice: car.carSessionPrice,
          captainLessonPrice: captain.captainLessonPrice,
        },
      });
    });

    return lesson;
  }

  static async getAll(userId: string, dataSafe: DTO.GetAllLessonsDto) {
    const { query, params } = dataSafe;
    const { academyId } = params;
    const { limit, page } = query;

    await validateOwnership(userId, academyId);

    const where: Prisma.LessonWhereInput = { academyId };

    const total = await prisma.lesson.count({ where });
    const { safePage, skip, totalPages } = getPaginationParams({
      limit,
      page,
      total,
    });

    const items = await prisma.lesson.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startTime: "asc" },
      include: {
        client: true,
        car: true,
        captain: { include: { user: true } },
        area: true,
      },
    });

    return { items, pagination: { limit, page: safePage, total, totalPages } };
  }

  static async getDetails(dataSafe: DTO.GetLessonDetailsDto) {
    const { id, academyId } = dataSafe.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        client: true,
        captain: true,
        car: true,
        area: true,
        subscription: true,
        paymentTransaction: true,
      },
    });

    if (!lesson) {
      throw ApiError.NotFound("Lesson");
    }

    return lesson;
  }

  static async update(dataSafe: DTO.UpdateLessonDto) {
    const { body, params } = dataSafe;
    const { id } = params;

    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        subscription: {
          include: { payments: body.expectedAmount ? true : false },
        },
      },
    });

    if (!existingLesson) {
      throw ApiError.NotFound("Lesson");
    }

    if (body.expectedAmount) {
      const { remaining } = calculatePaymentSummary(
        existingLesson.subscription.payments,
        existingLesson.subscription.priceAtBooking,
      );
      if (remaining < body.expectedAmount)
        throw ApiError.Conflict("OVERPAYMENT");
    }

    const finalCaptainId = body.captainId || existingLesson.captainId;
    const finalCarId = body.carId || existingLesson.carId;
    const finalAreaId = body.areaId || existingLesson.areaId;
    const finalTransmission = body.transmission || existingLesson.transmission;
    
    const newStartTime = body.startTime
      ? dayjs(body.startTime).toDate()
      : existingLesson.startTime;
    const duration = existingLesson.subscription.sessionDurationMinutes;
    const newEndTime = body.startTime
      ? dayjs(body.startTime).add(duration, "minute").toDate()
      : existingLesson.endTime;

    const [captain, car, area] = await Promise.all([
      prisma.captain.findUnique({ where: { id: finalCaptainId } }),
      prisma.car.findUnique({ where: { id: finalCarId } }),
      prisma.area.findUnique({ where: { id: finalAreaId } }),
    ]);

    if (!captain) throw ApiError.NotFound("Captain");
    if (!car) throw ApiError.NotFound("Car");
    if (!area) throw ApiError.NotFound("Area");

    if (
      captain.trainingType !== "BOTH" &&
      captain.trainingType !== finalTransmission
    ) {
      throw ApiError.BadRequest(
        `الكابتن لا يدعم التدريب على نوع ${finalTransmission}`,
      );
    }

    if (car.gearType !== finalTransmission) {
      throw ApiError.BadRequest(
        `السيارة المختارة نوعها ${car.gearType} ولا تطابق نوع التدريب ${finalTransmission}`,
      );
    }

    const needsOverlapCheck = body.startTime || body.captainId || body.carId;

    if (needsOverlapCheck) {
      const overlap = await prisma.lesson.findFirst({
        where: {
          id: { not: id },
          status: "SCHEDULED",
          OR: [
            { captainId: finalCaptainId },
            { carId: finalCarId },
            { clientId: existingLesson.clientId },
          ],
          startTime: { lt: newEndTime },
          endTime: { gt: newStartTime },
        },
      });

      if (overlap) {
        if (overlap.captainId === finalCaptainId)
          throw ApiError.Conflict("CaptainTimeConflict");
        if (overlap.carId === finalCarId)
          throw ApiError.Conflict("CarTimeConflict");
        if (overlap.clientId === existingLesson.clientId)
          throw ApiError.Conflict("ClientTimeConflict");
      }
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...body,
        startTime: newStartTime,
        endTime: newEndTime,
        captainLessonPrice: body.captainId
          ? captain.captainLessonPrice
          : existingLesson.captainLessonPrice,
        carSessionPrice: body.carId
          ? car.carSessionPrice
          : existingLesson.carSessionPrice,
      },
    });

    return updatedLesson;
  }

  static async changeState(userId: string, dataSafe: DTO.ChangeLessonStateDto) {
    const { body, params } = dataSafe;
    const { id, academyId } = params;
    const { status, amount, paymentMethod } = body;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        subscription: { include: { payments: amount ? true : false } },
      },
    });

    if (!lesson) throw ApiError.NotFound("Lesson");

    const result = await prisma.$transaction(async (tx) => {
      const updatedLesson = await tx.lesson.update({
        where: { id },
        data: {
          status,
        },
      });

      if (amount) {
        const { remaining } = calculatePaymentSummary(
          lesson.subscription.payments,
          lesson.subscription.priceAtBooking,
        );
        if (remaining < amount) throw ApiError.Conflict("OVERPAYMENT");

        await tx.paymentTransaction.create({
          data: {
            amount,
            paymentMethod: paymentMethod || "CASH",
            type: "PAYMENT",
            status: paymentMethod === "CASH" ? "COMPLETED" : "PENDING",
            clientId: lesson.clientId,
            subscriptionId: lesson.subscriptionId,
            lessonId: lesson.id,
            academyId: academyId,
            receiverId: userId,
          },
        });
      }

      return updatedLesson;
    });

    return result;
  }
}
