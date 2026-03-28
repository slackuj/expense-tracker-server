import {Router} from "express";
import {validateRequestBody} from "../middlewares/validator";
import {UserRegisterRequestSchema} from "../schemas/userSchema";
import * as authController from "../controllers/authController";

export const authRoutes = Router();
authRoutes.post("/register", validateRequestBody(UserRegisterRequestSchema), authController.register);