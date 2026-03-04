import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/area.validation";
import * as controller from "../controllers/area.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router();

router.get(
  "/active",
  validation(Schema.FilterAreasSchema),
  controller.getActiveAreas,
);

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllAreasSchema),
  checkRole(["OWNER"]),
  controller.getAllAreas,
);

router.post(
  "/",
  validation(Schema.CreateAreaSchema),
  checkRole(["OWNER"]),
  controller.createArea,
);

router.get(
  "/details/:id",
  validation(Schema.GetAreaDetailsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getDetailsArea,
);

router.patch(
  "/:id",
  validation(Schema.UpdateAreaSchema),
  checkRole(["OWNER"]),
  controller.updateArea,
);

router.delete(
  "/:id",
  validation(Schema.DeleteAreaSchema),
  checkRole(["OWNER"]),
  controller.deleteArea,
);

export default router;
