import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/client.validation";
import * as Service from "../services/client.service";
import checkRole from "../middlewares/role.middleware";
import { verifyAcademy } from "../middlewares/verifyAcademy.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER", "SECRETARY"]),
  Service.getAllClient,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER", "SECRETARY"]),
  verifyAcademy(false),
  Service.createClient,
);

router.get(
  "/deleted",
  validation(Schema.GetAllDeleted),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.getAllDeleted,
);

router.post(
  "/restore/:id",
  validation(Schema.Restore),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.restore,
);

router.get(
  "/:id",
  validation(Schema.GetDetails),
  checkRole(["OWNER"]),
  Service.getDetailsClient,
);

router.patch(
  "/:id",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.updateClient,
);

router.delete(
  "/:id",
  validation(Schema.Delete),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.deleteClient,
);

export default router;
