import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/lesson.validation";
import * as controller from "../controllers/lesson.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router({ mergeParams: true });

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.post(
  "/",
  validation(Schema.CreateLessonSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.createLesson,
);

router.get(
  "/",
  validation(Schema.GetAllLessonsSchema),
  checkRole(["OWNER"]),
  controller.getAllLessons,
);

router.get(
  "/:id",
  validation(Schema.GetLessonDetailsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getLessonDetails,
);

router.patch(
  "/:id",
  validation(Schema.UpdateLessonSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.updateLesson,
);

router.patch(
  "/:id/status",
  validation(Schema.ChangeLessonState),
  checkRole(["OWNER", "SECRETARY", "CAPTAIN"]),
  controller.changeLessonState,
);

export default router;
