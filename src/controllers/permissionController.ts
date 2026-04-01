import {Request, Response, NextFunction} from "express";
import {successResponse} from "../utils/responseHelper";
import * as permissionServices from "../services/permissionServices";
import {httpCodes} from "../constants/httpCodes";

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const response = await permissionServices.create(req.body);
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
        const response = await permissionServices.updateById(id, data);
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
        await permissionServices.deleteById(id);
        return successResponse(
            res,
            {
                status: httpCodes.RESOURCE_DELETED.statusCode,
            },
            );
    } catch (error) {
        next(error);
    }
};

export const getAll = async (
    res: Response,
    next: NextFunction
) => {
    try{
        const response = await permissionServices.getAll();
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
        const response = await permissionServices.getById(id);
        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};