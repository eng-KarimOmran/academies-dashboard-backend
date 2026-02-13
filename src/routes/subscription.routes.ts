import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/subscription.validation";
import * as Service from "../services/subscription.service";
import checkRole from "../middlewares/role.middleware";
import { verifyAcademy } from "../middlewares/verifyAcademy.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER", "SECRETARY"]),
  Service.getAllSubscription,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER", "SECRETARY"]),
  verifyAcademy(false),
  Service.createSubscription,
);

router.patch(
  "/unsubscribe/:id",
  validation(Schema.Unsubscribe),
  checkRole(["OWNER", "SECRETARY"]),
  verifyAcademy(false),
  Service.Unsubscribe,
);

router.get(
  "/:id",
  validation(Schema.GetDetails),
  checkRole(["OWNER"]),
  Service.getDetailsSubscription,
);

export default router;
