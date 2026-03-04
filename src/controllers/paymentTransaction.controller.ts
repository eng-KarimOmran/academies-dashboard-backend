import { Response } from "express";
import * as DTO from "../DTOs/paymentTransaction.dto";
import { RequestAuth } from "../middlewares/auth.middleware";
import { PaymentTransactionService } from "../services/paymentTransaction.service";
import sendSuccess from "../utils/successResponse";

export const createPaymentTransaction = async (
  req: RequestAuth,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.CreatePaymentTransactionDto;
  const userId = req.user!.id;

  const paymentTransaction = await PaymentTransactionService.create(
    userId,
    dataSafe,
  );

  return sendSuccess({
    res,
    statusCode: 201,
    data: paymentTransaction,
    message: "Payment transaction created successfully.",
  });
};

export const getAllPaymentTransactions = async (
  req: RequestAuth,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.GetAllPaymentTransactionsDto;
  const userId = req.user!.id;

  const data = await PaymentTransactionService.getAll(userId, dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getPaymentTransactionDetails = async (
  req: RequestAuth,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.GetPaymentTransactionDetailsDto;

  const transactionData = await PaymentTransactionService.getDetails(dataSafe);

  return sendSuccess({
    res,
    data: transactionData,
  });
};

export const updatePaymentTransaction = async (
  req: RequestAuth,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.UpdatePaymentTransactionDto;
  const userId = req.user!.id;

  const updatedTransaction = await PaymentTransactionService.update(
    userId,
    dataSafe,
  );

  return sendSuccess({
    res,
    data: updatedTransaction,
    message: "Payment transaction updated successfully.",
  });
};

export const deletePaymentTransaction = async (
  req: RequestAuth,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.DeletePaymentTransactionDto;
  const userId = req.user!.id;

  await PaymentTransactionService.delete(userId, dataSafe);

  return sendSuccess({
    res,
    message: "Payment transaction deleted successfully.",
  });
};
