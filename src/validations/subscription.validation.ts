import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  phone,
  transmission,
  cancelReason,
  price,
  paymentMethod,
} from "../utils/common.validation";

export const CreateSubscriptionSchema = {
  params: z.object({
    academyId: id,
  }),
  body: z.object({
    phone: phone,
    courseId: id,
    trainingTypeAtRegistration: transmission,
  }),
};

export const GetAllSubscriptionsSchema = {
  params: z.object({
    academyId: id,
  }),
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
    search: z.string().optional(),
  }),
};

export const GetSubscriptionDetailsSchema = {
  params: z.object({
    id: id,
    academyId: id,
  }),
};

export const DeleteSubscriptionSchema = {
  params: z.object({
    id: id,
    academyId: id,
  }),
};

export const CancelSubscriptionSchema = {
  params: z.object({
    academyId: id,
    subscriptionId: id,
  }),
  body: z.object({
    reason: cancelReason,
    refundAmount: price.optional(),
    paymentMethod: paymentMethod.optional(),
  }),
};
