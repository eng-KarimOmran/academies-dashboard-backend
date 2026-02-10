import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/course.validation";
import * as Service from "../services/course.service";
import checkRole from "../middlewares/role.middleware";
import { verifyAcademy } from "../middlewares/verifyAcademy.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER", "SECRETARY"]),
  Service.getAllCourse,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.createCourse,
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
  Service.getDetailsCourse,
);

router.patch(
  "/:id",
  validation(Schema.Update),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.updateCourse,
);

router.delete(
  "/:id",
  validation(Schema.Delete),
  checkRole(["OWNER"]),
  verifyAcademy(),
  Service.deleteCourse,
);

export default router;