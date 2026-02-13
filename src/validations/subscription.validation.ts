import z from "zod";

import {
  id,
  limit,
  positiveNumber,
  phone,
  paymentMethod,
  cancelReason,
} from "../utils/common.validation";

export const Create = {
  params: z.object({ academyId: id }),
  body: z.object({
    phone,
    courseId: id,
    amount: positiveNumber.min(50),
    paymentMethod,
  }),
};

export const GetAll = {
  params: z.object({ academyId: id }),
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetDetails = {
  params: z.object({ id, academyId: id }),
};

export const Unsubscribe = {
  params: z.object({ id, academyId: id }),
  body: z.object({
    reason: cancelReason,
    refundAmount: positiveNumber.optional().default(0),
    paymentMethod,
  }),
};
