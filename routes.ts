import { Router } from "express";
import routerAuth from "./src/modules/auth/auth.routes";
import auth from "./src/middlewares/auth.middleware";
import { TokenType } from "./src/utils/Token";
import routerAcademy from "./src/modules/academy/academy.routes";
import routerCourse from "./src/modules/course/course.routes";
import routerStudent from "./src/modules/student/student.routes";
import routerSubscription from "./src/modules/subscription/subscription.routes";
import routerTrainingZone from "./src/modules/trainingZone/trainingZone.routes";
import routerTrainer from "./src/modules/trainer/trainer.routes";
import routerCar from "./src/modules/car/car.routes";
import routerSession from "./src/modules/Session/session.routes";

const router = Router();

router.use("/auth", routerAuth);
router.use(auth(TokenType.ACCESS));
router.use("/student", routerStudent);
router.use("/academy", routerAcademy);
router.use("/course", routerCourse);
router.use("/subscription", routerSubscription);
router.use("/training-zone", routerTrainingZone);
router.use("/trainer", routerTrainer);
router.use("/car", routerCar);
router.use("/session", routerSession);

export default router;
