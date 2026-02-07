import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  trainingSupport,
  boolean,
} from "../utils/common.validation";

export const Create = {
  body: z.object({
    userId: id,
    captainLessonPrice: positiveNumber,
    trainingType: trainingSupport,
  }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    captainLessonPrice: positiveNumber.optional(),
    trainingType: trainingSupport.optional(),
    isActive: boolean.optional(),
  }),
};

export const GetAll = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id }),
};
