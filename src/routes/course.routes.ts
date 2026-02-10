import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/course.validation";
import * as Service from "../services/course.service";
import checkRole from "../middlewares/role.middleware";
import { isAcademyOwner } from "../middlewares/isAcademyOwner.middleware";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validation(Schema.GetAll),
  checkRole(["OWNER"]),
  Service.getAllCourse,
);

router.post(
  "/",
  validation(Schema.Create),
  checkRole(["OWNER"]),
  isAcademyOwner,
  Service.createCourse,
);

router.get(
  "/deleted",
  validation(Schema.GetAllDeleted),
  checkRole(["OWNER"]),
  isAcademyOwner,
  Service.getAllDeleted,
);

router.post(
  "/restore/:id",
  validation(Schema.Restore),
  checkRole(["OWNER"]),
  isAcademyOwner,
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
  isAcademyOwner,
  Service.updateCourse,
);

router.delete(
  "/:id",
  validation(Schema.Delete),
  checkRole(["OWNER"]),
  isAcademyOwner,
  Service.deleteCourse,
);

export default router;
