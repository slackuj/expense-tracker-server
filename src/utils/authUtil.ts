import jwt from "jsonwebtoken";
import { config } from "../config";
import {AuthenticatedUser} from "../types/user";

export const generateAccessToken = (user : AuthenticatedUser) => {
    // extract array of role names
    const userRoles: string[] = user.roles.map((role: any) => role.name);
    // Extract and flatten all Permission names from those roles
    // Use Set to ensure unique permissions if a user has multiple roles
    const permissionNames: string[] = Array.from(new Set(
        user.roles.flatMap((role: any) =>
            role.permissions ? role.permissions.map((p: any) => p.name) : []
        )
    ));
    //console.log(userRoles);
    //console.log(permissionNames);
    return jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 15 * 60, //  15 minutes
            id: user.id,
            name: user.name,
            email: user.email,
            roles: userRoles,
            permissions: permissionNames,
        },
        config.JWT_SECRET_ACCESS,
    )
};


export const generateRefreshToken = (user : AuthenticatedUser) => (
     jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,// 30 days
            userId: user.id,
        },
        config.JWT_SECRET_REFRESH,
    )
);