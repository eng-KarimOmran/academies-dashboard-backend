import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/captain.validation";
import * as Service from "../services/captain.service";
import checkRole from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER"]),
  Service.getAllCaptain,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER"]),
  Service.createCaptain,
);

router.get(
  "/:id",
  validation(Schema.GetDetails),
  checkRole(["OWNER"]),
  Service.getDetailsCaptain,
);

router.patch(
  "/:id",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  Service.updateCaptain,
);

export default router;
