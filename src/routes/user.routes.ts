import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/user.validation";
import * as controller from "../controllers/user.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router();

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllUsersSchema),
  checkRole(["OWNER"]),
  controller.getAllUser,
);

router.post(
  "/",
  validation(Schema.CreateUserSchema),
  checkRole(["OWNER"]),
  controller.createUser,
);

router.get(
  "/details/:id",
  validation(Schema.GetUserDetailsSchema),
  checkRole(["OWNER"]),
  controller.getDetailsUser,
);

router.patch(
  "/:id",
  validation(Schema.UpdateUserSchema),
  checkRole(["OWNER"]),
  controller.updateUser,
);

router.delete(
  "/:id",
  validation(Schema.DeleteUserSchema),
  checkRole(["OWNER"]),
  controller.deleteUser,
);

export default router;
