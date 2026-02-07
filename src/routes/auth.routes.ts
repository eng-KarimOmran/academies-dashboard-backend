import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import * as Schema from "../validations/auth.validation";
import * as Services from "../services/auth.service";

const router = Router();

router.post("/login", validation(Schema.LoginSchema), Services.login);

router.get("/refresh", auth(TokenType.REFRESH), Services.refresh);

router.post(
  "/logout",
  validation(Schema.LogoutSchema),
  auth(TokenType.ACCESS),
  Services.logout,
);

router.patch(
  "/change-password",
  validation(Schema.changePasswordSchema),
  auth(TokenType.ACCESS),
  Services.changePassword,
);

export default router;
