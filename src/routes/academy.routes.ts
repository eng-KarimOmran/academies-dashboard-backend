import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/academy.validation";
import * as controller from "../controllers/academy.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";
import routerCourse from "./course.routes";
import routerClient from "./client.routes";
import routerSubscription from "./subscription.routes";
import routerTransactions from "./paymentTransaction.routes";

import routerLesson from "./lesson.routes";

const router = Router();

router.get(
  "/details/:academyId",
  validation(Schema.GetAcademySchema),
  controller.getDetailsAcademy,
);

router.use("/:academyId/course", routerCourse);
router.use("/:academyId/client", routerClient);

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllAcademiesSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getAllAcademy,
);

router.post(
  "/",
  validation(Schema.CreateAcademySchema),
  checkRole(["OWNER"]),
  controller.createAcademy,
);

router.patch(
  "/:academyId",
  validation(Schema.UpdateAcademySchema),
  checkRole(["OWNER"]),
  controller.updateAcademy,
);

router.delete(
  "/:academyId",
  validation(Schema.DeleteAcademySchema),
  checkRole(["OWNER"]),
  controller.deleteAcademy,
);

router.use("/:academyId/subscription", routerSubscription);



router.use("/:academyId/transactions", routerTransactions);

router.use("/:academyId/lesson", routerLesson);

export default router;
