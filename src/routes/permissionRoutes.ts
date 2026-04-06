import {Router} from "express";
import {authenticate} from "../middlewares/authenticate";
import {validateParams, validateRequestBody} from "../middlewares/validator";
import {CreatePermissionSchema, UpdatePermissionSchema} from "../schemas/permissionSchema";
import * as permissionController from "../controllers/permissionController";
import {authorize} from "../middlewares/authorize";
import {appPermissions} from "../constants/permissions";
import {IdSchema} from "../schemas/globalSchema";

export const permissionRoutes = Router();
permissionRoutes.post("/", validateRequestBody(CreatePermissionSchema), authenticate, authorize(appPermissions.CREATE_PERMISSIONS.name), permissionController.create);
permissionRoutes.patch("/:id", validateParams(IdSchema), validateRequestBody(UpdatePermissionSchema), authenticate, authorize(appPermissions.MANAGE_PERMISSIONS.name), permissionController.updateById);
permissionRoutes.delete("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.MANAGE_PERMISSIONS.name), permissionController.deleteById);
permissionRoutes.get("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.VIEW_PERMISSIONS.name), permissionController.getById);
permissionRoutes.get("/", authenticate, authorize(appPermissions.VIEW_PERMISSIONS.name), permissionController.getAll);
