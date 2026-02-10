import z from "zod";

import {
  id,
  name,
  limit,
  positiveNumber,
  phone,
  paymentMethod,
} from "../utils/common.validation";

export const Create = {
  params: z.object({ academyId: id }),
  body: z.object({
    name,
    phone,
    courseId: id,
    amount: positiveNumber.min(50),
    paymentMethod,
  }),
};

export const Update = {
  params: z.object({ id, academyId: id }),
  body: z.object({
    name: name.optional(),
    phone: phone.optional(),
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
