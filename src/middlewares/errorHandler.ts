import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHelper";
import { ZodError } from "zod";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // 1. Handle Zod Validation Errors
    if (error instanceof ZodError) {
        const message = JSON.stringify(
            error.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            }))
        );

        return errorResponse(res, { status: 400, message });
    }

    const status = error.status || 500;
    const message = error.message || "Internal Server Error";

    return errorResponse(res, { status, message });
};