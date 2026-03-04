import { Router } from "express";
import routerAuth from "./auth.routes";
import routerUser from "./user.routes";
import routerAcademy from "./academy.routes";
import routerArea from "./area.routes";
import routerCaptain from "./captain.routes";
import routerCar from "./car.routes";
import routerSecretary from "./secretary.routes";

const router = Router();


router.use("/auth", routerAuth);
router.use("/user", routerUser);
router.use("/academy", routerAcademy);
router.use("/captain", routerCaptain);
router.use("/secretary", routerSecretary);
router.use("/car", routerCar);
router.use("/area", routerArea);

export default router;
