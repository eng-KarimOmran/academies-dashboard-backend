import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import * as Schema from "../validations/client.validation";
import * as controller from "../controllers/client.controller";
import checkRole from "../middlewares/role.middleware";
import auth from "../middlewares/auth.middleware";
import { TokenType } from "../utils/Token";
import { checkPasswordChange } from "../middlewares/checkPasswordChange.middlewares";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validation(Schema.CreateClientSchema),
  controller.createClient,
);

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.get(
  "/",
  validation(Schema.GetAllClientsSchema),
  checkRole(["OWNER"]),
  controller.getAllClients,
);

router.get(
  "/details/:id",
  validation(Schema.GetClientDetailsSchema),
  checkRole(["OWNER", "SECRETARY"]),
  controller.getDetailsClient,
);

router.patch(
  "/:id",
  validation(Schema.UpdateClientSchema),
  checkRole(["OWNER"]),
  controller.updateClient,
);

router.delete(
  "/:id",
  validation(Schema.DeleteClientSchema),
  checkRole(["OWNER"]),
  controller.deleteClient,
);

export default router;
