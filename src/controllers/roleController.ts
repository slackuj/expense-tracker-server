import {Request, Response, NextFunction} from "express";
import {notFoundResponse, successResponse} from "../utils/responseHelper";
import * as roleServices from "../services/roleServices";
import {httpCodes} from "../constants/httpCodes";

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const response = await roleServices.create(req.body);
        return successResponse(
            res,
            { data: response }
        );
    } catch (error) {
        next(error);
    }
};

export const updateById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = String(req.params.id);
        const data = req.body;
        const response = await roleServices.updateById(id, data);
        return successResponse(
            res,
            { data: response }
        );
    } catch (error) {
        next(error);
    }
};

export const deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = String(req.params.id);
        await roleServices.deleteById(id);
        return successResponse(
            res,
            {
                status: httpCodes.NO_CONTENT.statusCode,
            },
            );
    } catch (error) {
        next(error);
    }
};

export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const response = await roleServices.getAll();

        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};

export const getById = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = String(req.params.id);
        const response = await roleServices.getById(id);
        if (!response) {
            return notFoundResponse(
                res,
                {message : "Role not found"}
            );
        }
        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};