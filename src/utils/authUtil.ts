import jwt from "jsonwebtoken";
import { IUser } from "../models/UserModel";
import { config } from "../config";

export const generateAccessToken = (user : IUser) => (
    jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 15 * 60, //  15 minutes
            userId: user._id,
            name: user.name,
            email: user.email
        },
        config.JWT_SECRET_ACCESS,
    )
);


export const generateRefreshToken = (user : IUser) => (
     jwt.sign(
        {
            exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,// 30 days
            userId: user._id,
        },
        config.JWT_SECRET_REFRESH,
    )
);