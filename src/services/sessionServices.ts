import {SessionModel} from "../models/SessionModel";
import {UserSession} from "../types/user";

export const createSession = async(data: UserSession) => {
    const { userId, refreshToken, expiresAt } = data;
    return await SessionModel.create({
        userId,
        refreshToken,
        expiresAt
    });
};