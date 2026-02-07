import { Router } from "express";
import routerAuth from "./auth.routes";
import routerUser from "./user.routes";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router();

router.use("/auth", routerAuth);
router.use(auth(TokenType.ACCESS));
router.use(checkPasswordChange);
router.use("/user", routerUser);

export default router;
