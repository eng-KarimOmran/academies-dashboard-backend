import { Response } from "express";
import * as DTO from "../DTOs/subscription.dto";
import { RequestAuth } from "../middlewares/auth.middleware";
import { SubscriptionService } from "../services/subscription.service";
import sendSuccess from "../utils/successResponse";

export const createSubscription = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CreateSubscriptionDto;
  const userId = req.user!.id;

  const subscription = await SubscriptionService.create(userId, dataSafe);

  return sendSuccess({
    res,
    statusCode: 201,
    data: subscription,
    message: "تم إنشاء الاشتراك بنجاح",
  });
};

export const getAllSubscriptions = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.GetAllSubscriptionsDto;
  const userId = req.user!.id;

  const data = await SubscriptionService.getAll(userId, dataSafe);

  return sendSuccess({
    res,
    data,
  });
};

export const getSubscriptionDetails = async (
  req: RequestAuth,
  res: Response,
) => {
  const dataSafe = req.dataSafe as DTO.GetSubscriptionDetailsDto;

  const subscriptionData = await SubscriptionService.getDetails(dataSafe);

  return sendSuccess({
    res,
    data: subscriptionData,
  });
};

export const deleteSubscription = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.DeleteSubscriptionDto;
  const userId = req.user!.id;

  await SubscriptionService.delete(userId, dataSafe);

  return sendSuccess({
    res,
    message: "تم حذف الاشتراك نهائياً",
  });
};

export const cancelSubscription = async (req: RequestAuth, res: Response) => {
  const dataSafe = req.dataSafe as DTO.CancelSubscriptionDto;
  const userId = req.user!.id;

  const cancellationRecord = await SubscriptionService.cancel(userId, dataSafe);

  return sendSuccess({
    res,
    statusCode: 200,
    data: cancellationRecord,
    message: "Subscription cancelled successfully.",
  });
};