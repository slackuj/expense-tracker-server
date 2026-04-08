import {NextFunction, Response, Request} from "express";
import * as userServices from "../services/userServices";
import {successResponse} from "../utils/responseHelper";
import {AuthenticatedRequest} from "../types/request";

export const fetchAllUsers = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await userServices.fetchAllUsers();
        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};

export const fetchUserById = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = String(req.params.id);
        const response = await userServices.fetchUserById({userId: userId});
        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};

export const fetchSelf = async(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentUserId = req.user!.id; // authentication and authorization ensure that req.user is defined
        const response = await userServices.fetchUserById({currentUserId: currentUserId});
        return successResponse(
            res,
            { data: response },
        );
    } catch (error) {
        next(error);
    }
};

export const deleteUserById = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = String(req.params.id);
        await userServices.deleteUserById(userId);
        return successResponse(
            res,
            { status: 404 },
        );
    } catch (error) {
        next(error);
    }
};

export const updateUserRolesById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try{
        const id = String(req.params.id);
        const data = req.body;
        const currentUserId = req.user!.id;
        const response = await userServices.updateUserRolesById(id, data, currentUserId);
        return successResponse(
            res,
            { data: response }
        );
    } catch (error) {
        next(error);
    }
};