import {NextFunction, Response, Request} from "express";
import * as authServices from "../services/authServices";
import {successResponse, unauthorizedResponse} from "../utils/responseHelper";
import {httpCodes} from "../constants/httpCodes";

export const register = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //console.log('req received from zod after validation',req.body);
        await authServices.register(req.body);
        return successResponse(
            res,
            { status: httpCodes.RESOURCE_CREATED.statusCode }
        );
    } catch (error) {
        next(error);
    }
};

export const login = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await authServices.login(req.body);
        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};

export const refresh = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return unauthorizedResponse( res, { message: "Refresh token missing" });
        }

        const response = await authServices.refreshAccessToken(refreshToken);
        return successResponse( res, { data: response });
    } catch (error) {
        next(error);
    }
};

export const logout = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return unauthorizedResponse( res, { status: httpCodes.UNAUTHORIZED.statusCode, message: "Refresh token missing" });
        }

        await authServices.logout(refreshToken);
        return successResponse( res, { status: httpCodes.NO_CONTENT.statusCode } );
    } catch (error) {
        next(error);
    }
};