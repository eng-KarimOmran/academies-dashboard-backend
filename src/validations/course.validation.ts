import z from "zod";

import {
  id,
  name,
  limit,
  positiveNumber,
  string,
} from "../utils/common.validation";

export const Create = {
  params: z.object({ academyId: id }),
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
  }),
};

export const Update = {
  params: z.object({ id, academyId: id }),
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
  params: z.object({ id, academyId: id }),
};

export const GetAll = {
  params: z.object({ academyId: id }),

  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const Restore = {
  params: z.object({ id, academyId: id }),
};

export const GetAllDeleted = {
  params: z.object({ academyId: id }),

  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id, academyId: id }),
};
