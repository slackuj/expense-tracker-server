import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHelper";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const status: number = error.status || 500;
    const message: string = error.message || "Internal Server Error";

    return errorResponse(res, { status, message });
};