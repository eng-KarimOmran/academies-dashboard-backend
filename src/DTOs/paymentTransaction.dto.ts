import z from "zod";
import * as Schema from "../validations/paymentTransaction.validation";

export type CreatePaymentTransactionDto = {
  params: z.infer<typeof Schema.CreatePaymentTransactionSchema.params>;
  body: z.infer<typeof Schema.CreatePaymentTransactionSchema.body>;
};

export type GetAllPaymentTransactionsDto = {
  params: z.infer<typeof Schema.GetAllPaymentTransactionsSchema.params>;
  query: z.infer<typeof Schema.GetAllPaymentTransactionsSchema.query>;
};

export type GetPaymentTransactionDetailsDto = {
  params: z.infer<typeof Schema.GetPaymentTransactionDetailsSchema.params>;
};

export type UpdatePaymentTransactionDto = {
  params: z.infer<typeof Schema.UpdatePaymentTransactionSchema.params>;
  body: z.infer<typeof Schema.UpdatePaymentTransactionSchema.body>;
};

export type DeletePaymentTransactionDto = {
  params: z.infer<typeof Schema.DeletePaymentTransactionSchema.params>;
};
