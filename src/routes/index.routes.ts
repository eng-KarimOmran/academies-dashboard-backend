import { Router } from "express";
import routerAuth from "./auth.routes";
import routerUser from "./user.routes";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";
import routerAcademy from "./academy.routes";
import routerArea from "./area.routes";
import routerCaptain from "./captain.routes";
import routerCar from "./car.routes";
import routerSecretary from "./secretary.routes";
import routerCourse from "./course.routes";

const router = Router();

router.use("/auth", routerAuth);
router.use(auth(TokenType.ACCESS));
router.use(checkPasswordChange);
router.use("/user", routerUser);
router.use("/academy", routerAcademy);
router.use("/area", routerArea);
router.use("/captain", routerCaptain);
router.use("/secretary", routerSecretary);
router.use("/car", routerCar);
router.use("/course", routerCourse);

export default router;
