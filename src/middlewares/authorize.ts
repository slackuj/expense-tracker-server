import { NextFunction, Response } from "express";
import { AuthRequest } from "./authenticate";
import {appRoles} from "../constants/roles";
import {unauthorizedResponse} from "../utils/responseHelper";

export const authorize = (requiredPermission: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        const requestedId = String(req.params.id);
        if (!user) return next(new Error("User not authenticated"));
        // user.id from jwt, requestedId from params `/:id`
        const isOwner = user.id === requestedId;
        // BE CAUTIOUS ABOUT THIS AUTHORIZATION SIDE EFFECTS !!!!!
        if (isOwner) return next();

        // Bypass Super Admin
        if (user.roles.includes("SUPER_ADMIN")) return next();

        //Aggregating user permissions
        const userPermissions = user.roles.flatMap(roleName => {
            // Look up the role in roles.ts !
            const roleConfig = appRoles[roleName as keyof typeof appRoles];
            return roleConfig.permissions;
        });

        // Check for the required permission
        if (!userPermissions.includes(requiredPermission)) {
            return unauthorizedResponse(res, {});
        }
        next();
    }
};