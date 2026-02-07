import { Router } from "express";
import routerAuth from "./auth.routes";
import routerUser from "./user.routes";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";
import routerAcademy from "./academy.routes";
import routerArea from "./area.routes";

const router = Router();

router.use("/auth", routerAuth);
router.use(auth(TokenType.ACCESS));
router.use(checkPasswordChange);
router.use("/user", routerUser);
router.use("/academy", routerAcademy);
router.use("/area", routerArea);

export default router;
