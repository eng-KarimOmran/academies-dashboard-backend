import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/academy.validation";
import * as Service from "../services/academy.service";
import checkRole from "../middlewares/role.middleware";
import routerCourse from "./course.routes";

const router = Router();

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER"]),
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
  "/restore/:id",
  validation(Schema.Restore),
  checkRole(["OWNER"]),
  Service.restore,
);

router.get(
  "/:id",
  validation(Schema.GetDetails),
  checkRole(["OWNER"]),
  Service.getDetailsAcademy,
);

router.patch(
  "/:id",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  Service.updateAcademy,
);

router.delete(
  "/:id",
  validation(Schema.Delete),
  checkRole(["OWNER"]),
  Service.deleteAcademy,
);

router.use("/:academyId/course", routerCourse);
export default router;