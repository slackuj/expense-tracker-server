import {Router} from "express";
import {validateRequestBody} from "../middlewares/validator";
import {UserLoginRequestSchema, UserRegisterRequestSchema} from "../schemas/authSchema";
import * as authController from "../controllers/authController";
import {authenticate} from "../middlewares/authenticate";

export const authRoutes = Router();

authRoutes.post("/register", validateRequestBody(UserRegisterRequestSchema), authController.register);
authRoutes.post("/login", validateRequestBody(UserLoginRequestSchema), authController.login);
authRoutes.post("/refresh", authController.refresh);
authRoutes.post("/logout", authenticate, authController.refresh);
