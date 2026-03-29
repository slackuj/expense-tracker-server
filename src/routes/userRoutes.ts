import {Router} from "express";
import * as userController from "../controllers/userController";

export const userRoutes = Router();

userRoutes.get("/", userController.fetchAllUsers);
userRoutes.get("/:id", userController.fetchUserById);
userRoutes.delete("/:id", userController.deleteUserById);
