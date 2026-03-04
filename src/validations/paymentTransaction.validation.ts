import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  paymentMethod,
  transactionStatus,
} from "../utils/common.validation";

export const CreatePaymentTransactionSchema = {
  params: z.object({ academyId: id }),
  body: z.object({
    amount: positiveNumber,
    paymentMethod,
    subscriptionId: id,
    lessonId: id.optional(),
  }),
};

export const GetAllPaymentTransactionsSchema = {
  params: z.object({ academyId: id }),
  query: z.object({
    page: positiveNumber.optional().default(1),
    limit: limit,
  }),
};

export const GetPaymentTransactionDetailsSchema = {
  params: z.object({ id, academyId: id }),
};

export const UpdatePaymentTransactionSchema = {
  params: z.object({ id, academyId: id }),
  body: z.object({
    amount: positiveNumber.optional(),
    paymentMethod: paymentMethod.optional(),
    status: transactionStatus.optional(),
  }),
};

export const DeletePaymentTransactionSchema = {
  params: z.object({ id, academyId: id }),
};
