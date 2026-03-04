import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/car.validation";
import * as controller from "../controllers/car.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router();

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllCarsSchema),
  checkRole(["OWNER"]),
  controller.getAllCars,
);

router.post(
  "/",
  validation(Schema.CreateCarSchema),
  checkRole(["OWNER"]),
  controller.createCar,
);

router.get(
  "/active",
  validation(Schema.FilterByTypeSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getActiveCars,
);

router.get(
  "/details/:id",
  validation(Schema.GetCarDetailsSchema),
  checkRole(["OWNER"]),
  controller.getDetailsCar,
);

router.patch(
  "/:id",
  validation(Schema.UpdateCarSchema),
  checkRole(["OWNER"]),
  controller.updateCar,
);

router.delete(
  "/:id",
  validation(Schema.DeleteCarSchema),
  checkRole(["OWNER"]),
  controller.deleteCar,
);

export default router;
