import {Router} from "express";
import * as userController from "../controllers/userController";

export const userRoutes = Router();

userRoutes.post("/", userController.fetchAllUsers);
userRoutes.post("/:id", userController.fetchUserById);
userRoutes.delete("/:id", userController.deleteUserById);
