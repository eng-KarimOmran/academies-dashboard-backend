import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/subscription.validation";
import * as controller from "../controllers/subscription.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router({ mergeParams: true });

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.post(
  "/",
  validation(Schema.CreateSubscriptionSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.createSubscription,
);

router.get(
  "/",
  validation(Schema.GetAllSubscriptionsSchema),
  checkRole(["OWNER"]),
  controller.getAllSubscriptions,
);

router.get(
  "/details/:id",
  validation(Schema.GetSubscriptionDetailsSchema),
  checkRole(["OWNER"]),
  controller.getSubscriptionDetails,
);

router.post(
  "/cancel/:subscriptionId",
  validation(Schema.CancelSubscriptionSchema),
  checkRole(["OWNER"]),
  controller.cancelSubscription,
);

router.delete(
  "/:id",
  validation(Schema.DeleteSubscriptionSchema),
  checkRole(["OWNER"]),
  controller.deleteSubscription,
);

export default router;
