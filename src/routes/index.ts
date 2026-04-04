import {Router} from "express";
import {authRoutes} from "./authRoutes";
import {userRoutes} from "./userRoutes";
import {permissionRoutes} from "./permissionRoutes";
import {roleRoutes} from "./roleRoutes";

export const routes = Router();
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/permissions", permissionRoutes);
routes.use("/roles", roleRoutes);
