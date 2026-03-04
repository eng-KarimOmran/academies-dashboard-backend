import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/secretary.validation"; // تأكد من اسم ملف الـ Validation لديك
import * as controller from "../controllers/secretary.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router();

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllSecretariesSchema),
  checkRole(["OWNER"]),
  controller.getAllSecretary
);

router.post(
  "/",
  validation(Schema.CreateSecretarySchema),
  checkRole(["OWNER"]),
  controller.createSecretary
);

router.get(
  "/details/:id",
  validation(Schema.GetSecretaryDetailsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getDetailsSecretary
);

router.patch(
  "/:id",
  validation(Schema.UpdateSecretarySchema),
  checkRole(["OWNER"]),
  controller.updateSecretary
);

router.delete(
  "/:id",
  validation(Schema.DeleteSecretarySchema),
  checkRole(["OWNER"]),
  controller.deleteSecretary
);

export default router;