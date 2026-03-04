import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  trainingSupport,
  boolean,
  phone,
  transmission,
  date,
} from "../utils/common.validation";

export const CreateCaptainSchema = {
  body: z.object({
    phone: phone,
    captainLessonPrice: positiveNumber,
    trainingType: trainingSupport.default("BOTH"),
  }),
};

export const UpdateCaptainSchema = {
  params: z.object({ id }),
  body: z.object({
    captainLessonPrice: positiveNumber.optional(),
    trainingType: trainingSupport.optional(),
    isActive: boolean.optional(),
  }),
};

export const GetAllCaptainsSchema = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetCaptainDetailsSchema = {
  params: z.object({ id }),
};

export const DeleteCaptainSchema = {
  params: z.object({ id }),
};

export const FilterCaptainsSchema = {
  query: z.object({
    type: transmission.optional(),
  }),
};

export const GetCaptainScheduleSchema = {
  params: z.object({
    id,
  }),
  query: z.object({
    date,
  }),
};
