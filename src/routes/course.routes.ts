import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/course.validation";
import * as controller from "../controllers/course.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router({ mergeParams: true });

router.get(
  "/active",
  validation(Schema.GetActiveSchema),
  controller.getActiveCourses,
);

router.get(
  "/details/:id",
  validation(Schema.GetDetailsSchema),
  controller.getDetailsCourse,
);

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getAllCourses,
);

router.post(
  "/",
  validation(Schema.CreateSchema),
  checkRole(["OWNER"]),
  controller.createCourse,
);

router.patch(
  "/:id",
  validation(Schema.UpdateSchema),
  checkRole(["OWNER"]),
  controller.updateCourse,
);

router.delete(
  "/:id",
  validation(Schema.DeleteSchema),
  checkRole(["OWNER"]),
  controller.deleteCourse,
);

export default router;