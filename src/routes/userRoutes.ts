import {Router} from "express";
import * as userController from "../controllers/userController";
import {authenticate} from "../middlewares/authenticate";

export const userRoutes = Router();

userRoutes.get("/", authenticate, userController.fetchAllUsers);
userRoutes.get("/:id", authenticate, userController.fetchUserById);
// create a separate middleware for deletion that allows the user to delete him/herself only. it should allow admin to delete other users
userRoutes.delete("/:id", authenticate, userController.deleteUserById);
