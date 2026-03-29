import {NextFunction, Response, Request} from "express";
import * as authServices from "../services/authServices";
import {successResponse} from "../utils/responseHelper";
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