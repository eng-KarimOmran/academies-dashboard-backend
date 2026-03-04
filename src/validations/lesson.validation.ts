import z from "zod";

import {
  id,
  limit,
  positiveNumber,
  futureDate,
  lessonStatus,
  transmission,
  paymentMethod,
  price,
} from "../utils/common.validation";

export const CreateLessonSchema = {
  params: z.object({
    academyId: id,
  }),
  body: z.object({
    startTime: futureDate,
    transmission: transmission,
    captainId: id,
    carId: id,
    areaId: id,
    subscriptionId: id,
    expectedAmount: price,
  }),
};

export const GetAllLessonsSchema = {
  params: z.object({
    academyId: id,
  }),
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetLessonDetailsSchema = {
  params: z.object({
    academyId: id,
    id: id,
  }),
};

export const UpdateLessonSchema = {
  params: z.object({
    academyId: id,
    id: id,
  }),
  body: z.object({
    startTime: futureDate.optional(),
    captainId: id.optional(),
    carId: id.optional(),
    areaId: id.optional(),
    expectedAmount: positiveNumber.optional(),
    transmission: transmission.optional(),
  }),
};

export const ChangeLessonState = {
  params: z.object({ id, academyId: id }),
  body: z.object({
    status: lessonStatus,
    amount: positiveNumber.optional(),
    paymentMethod: paymentMethod.optional().default("CASH"),
  }),
};
