import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/secretary.validation";
import * as Service from "../services/secretary.service";
import checkRole from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER"]),
  Service.getAllSecretary,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER"]),
  Service.createSecretary,
);

router.get(
  "/:id",
  validation(Schema.GetDetails),
  checkRole(["OWNER"]),
  Service.getDetailsSecretary,
);

router.patch(
  "/:id",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  Service.updateSecretary,
);

export default router;
