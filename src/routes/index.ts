import {Router} from "express";
import {authRoutes} from "./authRouter";

export const routes = Router();
routes.use("/auth", authRoutes);