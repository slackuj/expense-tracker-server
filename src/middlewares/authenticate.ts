// checks for access token ! and populates Request with the user
import { Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHelper";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthenticatedUser } from "../types/user";
import {AuthRequest} from "../types/request";

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return errorResponse(res, { status: 401, message: "No Access Token Provided" });
    }

    req.user = jwt.verify(token, config.JWT_SECRET_ACCESS) as AuthenticatedUser;
    //console.log(`req.user inside authenticate.ts : ${JSON.stringify(req.user)}`);
    next();
}