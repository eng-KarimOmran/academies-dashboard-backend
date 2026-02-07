import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/user.validation";
import * as Service from "../services/user.service";
import checkRole from "../middlewares/role.middleware";

const router = Router();

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER"]),
  Service.getAllUser,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER"]),
  Service.createUser,
);

router.get(
  "/deleted",
  validation(Schema.GetAllDeleted),
  checkRole(["OWNER"]),
  Service.getAllDeleted,
);

router.post(
  "/restore/:id",
  validation(Schema.Restore),
  checkRole(["OWNER"]),
  Service.restore,
);

router.get(
  "/:id",
  validation(Schema.GetDetails),
  checkRole(["OWNER", "SECRETARY", "CAPTAIN"]),
  Service.getDetailsUser,
);

router.patch(
  "/:id",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  Service.updateUser,
);

router.delete(
  "/:id",
  validation(Schema.Delete),
  checkRole(["OWNER"]),
  Service.deleteUser,
);

export default router;
