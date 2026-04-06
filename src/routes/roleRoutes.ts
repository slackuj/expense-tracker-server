import {Router} from "express";
import {authenticate} from "../middlewares/authenticate";
import {validateParams, validateRequestBody} from "../middlewares/validator";
import {CreateRoleSchema, UpdateRoleSchema} from "../schemas/roleSchema";
import * as roleController from "../controllers/roleController";
import {appPermissions} from "../constants/permissions";
import {authorize} from "../middlewares/authorize";
import {IdSchema} from "../schemas/globalSchema";

export const roleRoutes = Router();
roleRoutes.post("/", validateRequestBody(CreateRoleSchema), authenticate, authorize(appPermissions.CREATE_ROLES.name), roleController.create);
roleRoutes.patch("/:id", validateParams(IdSchema), validateRequestBody(UpdateRoleSchema), authenticate, authorize(appPermissions.MANAGE_ROLES.name), roleController.updateById);
roleRoutes.delete("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.MANAGE_ROLES.name), roleController.deleteById);
roleRoutes.get("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.VIEW_ROLES.name), roleController.getById);
roleRoutes.get("/", authorize(appPermissions.VIEW_ROLES.name),  authenticate, roleController.getAll);
