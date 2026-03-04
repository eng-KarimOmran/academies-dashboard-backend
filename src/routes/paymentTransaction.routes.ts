import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/paymentTransaction.validation";
import * as controller from "../controllers/paymentTransaction.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router({ mergeParams: true });

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.post(
  "/",
  validation(Schema.CreatePaymentTransactionSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.createPaymentTransaction,
);

router.get(
  "/",
  validation(Schema.GetAllPaymentTransactionsSchema),
  checkRole(["OWNER"]),
  controller.getAllPaymentTransactions,
);

router.get(
  "/:id",
  validation(Schema.GetPaymentTransactionDetailsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getPaymentTransactionDetails,
);

router.patch(
  "/:id",
  validation(Schema.UpdatePaymentTransactionSchema),
  checkRole(["OWNER"]),
  controller.updatePaymentTransaction,
);

router.delete(
  "/:id",
  validation(Schema.DeletePaymentTransactionSchema),
  checkRole(["OWNER"]),
  controller.deletePaymentTransaction,
);

export default router;
