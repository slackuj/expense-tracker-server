import {Router} from "express";
import {authenticate} from "../middlewares/authenticate";
import {validateParams, validateRequestBody} from "../middlewares/validator";
import {CreateRoleSchema, RoleIdSchema, UpdateRoleSchema} from "../schemas/roleSchema";
import * as roleController from "../controllers/roleController";

export const roleRoutes = Router();
// authorization to be implemented: authorizeWithRole
roleRoutes.post("/", authenticate, validateRequestBody(CreateRoleSchema), roleController.create);
roleRoutes.patch("/:id", authenticate, validateParams(RoleIdSchema), validateRequestBody(UpdateRoleSchema), roleController.updateById);
roleRoutes.delete("/:id", authenticate, validateParams(RoleIdSchema), roleController.deleteById);
roleRoutes.get("/:id", authenticate, validateParams(RoleIdSchema), roleController.getById);
roleRoutes.get("/", authenticate, roleController.getAll);
