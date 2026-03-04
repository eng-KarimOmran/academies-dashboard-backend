import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/captain.validation";
import * as controller from "../controllers/captain.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router();

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllCaptainsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getAllCaptains,
);

router.post(
  "/",
  validation(Schema.CreateCaptainSchema),
  checkRole(["OWNER"]),
  controller.createCaptain,
);

router.get(
  "/active",
  validation(Schema.FilterCaptainsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getActiveCaptains,
);

router.get(
  "/details/:id",
  validation(Schema.GetCaptainDetailsSchema),
  checkRole(["OWNER", "CAPTAIN"]),
  controller.getDetailsCaptain,
);

router.get(
  "/lessons/:id",
  validation(Schema.GetCaptainScheduleSchema),
  checkRole(["OWNER", "SECRETARY", "CAPTAIN"]),
  controller.getCaptainSchedule,
);

router.patch(
  "/:id",
  validation(Schema.UpdateCaptainSchema),
  checkRole(["OWNER"]),
  controller.updateCaptain,
);

router.delete(
  "/:id",
  validation(Schema.DeleteCaptainSchema),
  checkRole(["OWNER"]),
  controller.deleteCaptain,
);

export default router;
