import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import * as Schema from "../validations/auth.validation";
import * as controller from "../controllers/auth.controller";

const router = Router();

router.post("/login", validation(Schema.LoginSchema), controller.login);

router.get("/refresh", auth(TokenType.REFRESH), controller.refresh);

router.post(
  "/logout",
  auth(TokenType.REFRESH),
  validation(Schema.LogoutSchema),
  controller.logout,
);

router.patch(
  "/change-password",
  auth(TokenType.ACCESS),
  validation(Schema.changePasswordSchema),
  controller.changePassword,
);

export default router;
