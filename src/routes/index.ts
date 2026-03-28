import {Router} from "express";
import {authRoutes} from "./authRouter";

export const router = Router();
router.use("/auth", authRoutes);