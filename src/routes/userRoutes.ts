import {Router} from "express";
import * as userController from "../controllers/userController";
import {authenticate} from "../middlewares/authenticate";
import {authorize} from "../middlewares/authorize";
import {appPermissions} from "../constants/permissions";
import {validateParams} from "../middlewares/validator";
import {IdSchema} from "../schemas/globalSchema";

export const userRoutes = Router();

userRoutes.get("/", authenticate, authorize(appPermissions.VIEW_USERS.name), userController.fetchAllUsers);
userRoutes.get("/me", authenticate, userController.fetchSelf);
userRoutes.get("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.VIEW_USERS.name), userController.fetchUserById);
// create a separate middleware for deletion that allows the user to delete him/herself only. it should allow admin to delete other users
userRoutes.delete("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.MANAGE_USERS.name), userController.deleteUserById);
userRoutes.patch("/:id", validateParams(IdSchema), authenticate, authorize(appPermissions.MANAGE_USER_ROLES.name), userController.updateUserRolesById);