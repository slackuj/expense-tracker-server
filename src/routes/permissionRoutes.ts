import {Router} from "express";
import {authenticate} from "../middlewares/authenticate";
import {validateParams, validateRequestBody} from "../middlewares/validator";
import {CreatePermissionSchema, PermissionIdSchema, UpdatePermissionSchema} from "../schemas/permissionSchema";
import * as permissionController from "../controllers/permissionController";

export const permissionRoutes = Router();
// authorization to be implemented: authorizeWithPermission
permissionRoutes.post("/", authenticate, validateRequestBody(CreatePermissionSchema), permissionController.create);
permissionRoutes.patch("/:id", authenticate, validateParams(PermissionIdSchema), validateRequestBody(UpdatePermissionSchema), permissionController.updateById);
permissionRoutes.delete("/:id", authenticate, validateParams(PermissionIdSchema), permissionController.deleteById);
permissionRoutes.get("/:id", authenticate, validateParams(PermissionIdSchema), permissionController.getById);
permissionRoutes.get("/", authenticate, permissionController.getAll);
