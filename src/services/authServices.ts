import {UserLoginRequest, UserRegisterRequest} from "../types/user";
import {UserModel} from "../models/UserModel";
import {SALT_ROUNDS} from "../constants/authConstants";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../utils/authUtil";
import jwt, {JwtPayload} from "jsonwebtoken";
import {config} from "../config";
import * as sessionServices from "./sessionServices";

type registerData = Omit<UserRegisterRequest, "confirmPassword">;
export const register = async (data: registerData) => {
    const { name, email, password } = data;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return await UserModel.create({
        name,
        email,
        password: hashedPassword
    });
};

export const login = async (data: UserLoginRequest) => {

    const { email, password } = data;
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("The password you entered is incorrect.");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    try {
        const refreshTokenData = jwt.verify(refreshToken, config.JWT_SECRET_REFRESH) as JwtPayload;
        const expiresAt = new Date(refreshTokenData.exp! * 1000);
        await sessionServices.createSession({
            userId: user._id,
            refreshToken,
            expiresAt
        });
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        //console.log(error);
        throw new Error("Failed to initialize session. Please try again.");
    }
};

/*
export const logout = async (refreshToken: string) => {
    await sessionServices.deleteSessionByRefreshToken(refreshToken);
};*/
