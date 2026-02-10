import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/academy.validation";
import * as Service from "../services/academy.service";
import checkRole from "../middlewares/role.middleware";
import routerCourse from "./course.routes";
import { verifyAcademy } from "../middlewares/verifyAcademy.middleware";
import routerClient from "./client.routes";

const router = Router();

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER", "SECRETARY"]),
  Service.getAllAcademy,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER"]),
  Service.createAcademy,
);

router.get(
  "/deleted",
  validation(Schema.GetAllDeleted),
  checkRole(["OWNER"]),
  Service.getAllDeleted,
);

router.post(
  "/restore/:academyId",
  validation(Schema.Restore),
  checkRole(["OWNER"]),
  Service.restore,
);

router.get(
  "/:academyId",
  validation(Schema.GetDetails),
  checkRole(["OWNER"]),
  verifyAcademy(true),
  Service.getDetailsAcademy,
);

router.patch(
  "/:academyId",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  verifyAcademy(true),
  Service.updateAcademy,
);

router.delete(
  "/:academyId",
  validation(Schema.Delete),
  checkRole(["OWNER"]),
  verifyAcademy(true),
  Service.deleteAcademy,
);

router.use("/:academyId/course", routerCourse);
router.use("/:academyId/client", routerClient);
export default router;
