import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/request";
import {unauthorizedResponse} from "../utils/responseHelper";

export const authorize = (requiredPermission: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        const requestedId = String(req.params.id);
        if (!user) return next(new Error("User not authenticated"));
        // user.id from jwt, requestedId from params `/:id`
        const isOwner = user.id === requestedId;
        // BE CAUTIOUS ABOUT THIS AUTHORIZATION SIDE EFFECTS !!!!!
        if (isOwner) return next();

        // Bypass Super Admin
        if (user.roles.includes("SUPER_ADMIN")) return next();

        // Check for the required permission
        if (!user.permissions.includes(requiredPermission)) {
            return unauthorizedResponse(res, {});
        }
        next();
    }
};