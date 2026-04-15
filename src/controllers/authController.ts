import {NextFunction, Response, Request} from "express";
import * as mailServices from "../services/mailServices";
import * as authServices from "../services/authServices";
import {successResponse, unauthorizedResponse} from "../utils/responseHelper";
import {httpCodes} from "../constants/httpCodes";

export const confirm = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await authServices.confirm(req.body);
        return successResponse(
            res,
            { status: httpCodes.RESOURCE_CREATED.statusCode }
        );
    } catch (error) {
        next(error);
    }
};

export const register = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const { email } = req.body;
        const generatedOTP = await mailServices.sendNewAccountConfirmationEmail(email);
        // create temp user
        const response = await authServices.register(req.body, generatedOTP);
        // return response
        return successResponse(
            res,
            {
                status: httpCodes.RESOURCE_CREATED.statusCode,
                data: {
                    expiresAt: response.expiresAt.getTime(),
                    email: email,
                },
                message: "check your email for the confirmation code",
            },
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
        // set refreshToken in a secure cookie
        res.cookie("refreshToken", response.refreshToken,{
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        return successResponse(
            res,
            { data: { accessToken :response.accessToken } },
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
            return unauthorizedResponse( res, { status: httpCodes.UNAUTHORIZED.statusCode, message: "Refresh token missing" });
        }

        const response = await authServices.refreshAccessToken(refreshToken);
        // set refreshToken in a secure cookie
        res.cookie("refreshToken", response.refreshToken,{
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        return successResponse(
            res,
            { data: { accessToken :response.accessToken } },
        );
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
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return successResponse( res, { status: httpCodes.NO_CONTENT.statusCode } );
    } catch (error) {
        next(error);
    }
};