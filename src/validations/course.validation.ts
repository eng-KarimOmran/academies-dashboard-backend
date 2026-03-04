import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  entityName,
  boolean,
} from "../utils/common.validation";

export const CreateSchema = {
  params: z.object({ academyId: id }),
  body: z.object({
    name: entityName,
    description: z.string(),
    priceOriginal: positiveNumber,
    priceDiscounted: positiveNumber.optional(),
    totalSessions: positiveNumber,
    practicalSessions: positiveNumber,
    sessionDurationMinutes: positiveNumber.optional().default(50),
    trainingDetails: z.array(z.string()).optional(),
    featuredReason: z.string().optional(),
  }),
};

export const UpdateSchema = {
  params: z.object({ id, academyId: id }),
  body: z.object({
    name: entityName.optional(),
    description: z.string().optional(),
    priceOriginal: positiveNumber.optional(),
    priceDiscounted: positiveNumber.optional(),
    totalSessions: positiveNumber.optional(),
    practicalSessions: positiveNumber.optional(),
    sessionDurationMinutes: positiveNumber.optional(),
    trainingDetails: z.array(z.string()).optional(),
    featuredReason: z.string().optional(),
    isActive: boolean,
  }),
};

export const DeleteSchema = {
  params: z.object({ id, academyId: id }),
};

export const GetAllSchema = {
  params: z.object({ academyId: id }),
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetDetailsSchema = {
  params: z.object({ id, academyId: id }),
};

export const GetActiveSchema = {
  params: z.object({ academyId: id }),
};
