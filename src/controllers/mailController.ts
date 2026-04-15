import {Request, Response, NextFunction} from "express";
import * as mailServices from "../services/mailServices";

export const confirmNewAccount = async(
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try{
        const { email } = req.body;
        await mailServices.sendNewAccountConfirmationEmail(email);
        // create temp user
        // return response
    } catch (error) {
        next(error);
    }
};