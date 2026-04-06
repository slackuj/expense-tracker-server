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

// used when user's account is being deleted or user roles are updated
export const deleteSessionsById = async (userId: string) => {
    // using deletMany considering multiple device login
    await SessionModel.deleteMany({
        userId
    });
};

// delete sessionByToken
export const deleteSessionByToken = async (refreshToken: string) => {
    // using deletMany considering multiple device login
    await SessionModel.deleteOne({
        refreshToken
    });
};

//find session by refresh token
export const findSessionByToken = async (refreshToken: string) => {
    return await SessionModel.findOne({ refreshToken }).exec();
};

/*
                  U S E D    D U R I N G    L O G O U T
export const deleteSessionByRefreshToken = async (refreshToken: string) => {
    await SessionModel.findOneAndDelete({
        refreshToken
    });
};*/
