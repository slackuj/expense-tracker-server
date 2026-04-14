import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHelper";
import {TokenExpiredError} from "jsonwebtoken";
import {httpCodes} from "../constants/httpCodes";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { status, message } = error;
    if (error instanceof TokenExpiredError) {
        return errorResponse(
            res,
            {
                status: httpCodes.UNAUTHORIZED.statusCode,
                message: "Access Token Expired"
            }
        );
    }

    return errorResponse(res, { status, message });
};