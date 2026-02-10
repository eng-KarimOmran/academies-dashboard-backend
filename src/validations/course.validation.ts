import z from "zod";

import {
  id,
  name,
  limit,
  positiveNumber,
  string,
} from "../utils/common.validation";

export const Create = {
  body: z.object({
    name,
    description: string,
    priceOriginal: positiveNumber,
    priceDiscounted: positiveNumber.optional(),
    totalSessions: positiveNumber,
    practicalSessions: positiveNumber,
    sessionDurationMinutes: positiveNumber.optional().default(50),
    trainingDetails: z.array(string).optional(),
    featuredReason: string.optional(),
    academyId: id,
  }),
};

export const Update = {
  params: z.object({ id }),
  body: z.object({
    name: name.optional(),
    description: string.optional(),
    priceOriginal: positiveNumber.optional(),
    priceDiscounted: positiveNumber.optional(),
    totalSessions: positiveNumber.optional(),
    practicalSessions: positiveNumber.optional(),
    sessionDurationMinutes: positiveNumber.optional(),
    trainingDetails: z.array(string).optional(),
    featuredReason: string.optional(),
  }),
};

export const Delete = {
  params: z.object({ id }),
};

export const GetAll = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const Restore = {
  params: z.object({ id }),
};

export const GetAllDeleted = {
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id }),
};
