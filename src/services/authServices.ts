import {AuthenticatedUser, UserLoginRequest, UserRegisterRequest} from "../types/user";
import {UserModel} from "../models/UserModel";
import {SALT_ROUNDS} from "../constants/authConstants";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../utils/authUtil";
import jwt, {JwtPayload} from "jsonwebtoken";
import {config} from "../config";
import * as sessionServices from "./sessionServices";
import {RoleModel} from "../models/RoleModel";

type registerData = Omit<UserRegisterRequest, "confirmPassword">;
export const register = async (data: registerData) => {
    const { name, email, password } = data;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const role = await RoleModel.findOne({ name: "USER" }).select({ id: 1 }).lean();
    if (!role) {
        throw new Error("Role 'USER' does not exist");
    }
    return await UserModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [String(role._id)] // default role === "USER" ---- using _id because mongoose.plugin will not work here, as we are using lean() !!!
    });
};

export const login = async (data: UserLoginRequest) => {

    const { email, password } = data;
    const user = await UserModel.findOne({ email })
        .populate({
        path: "roles",
        select: "name -_id",
        //transform: doc => doc === null ? null : doc.name,
            populate: {
                path:"permissions",
                select: "name -_id",
                //transform: doc => doc === null ? null : doc.name,
            },
        }) // ( roles  & names ) object array mapped into names array inside generateAccessToken
        .select("+password") as AuthenticatedUser;


    if (!user) {
        throw new Error("The email you entered isn't connected to an account");
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
            userId: user.id,
            refreshToken,
            expiresAt
        });
        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        //console.log(error);
        throw new Error("Failed to initialize session. Please try again.");
    }
};

export const refreshAccessToken = async (refreshToken: string) => {
    // 1. Verify the signature and expiration of the refresh token
    let payload: JwtPayload;
    try {
        payload = jwt.verify(refreshToken, config.JWT_SECRET_REFRESH) as JwtPayload;
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }

    // 2. Check if the session exists in the DB (Stateful check)
    const session = await sessionServices.findSessionByToken(refreshToken);
    if (!session) {
        throw new Error("Session not found");
    }

    // 3. Fetch the user to get the latest data for the new access token
    // required for cases like database sync failure on user deletion or user may be deactivated/banned etc...
    const user = await UserModel.findById(payload.userId)
        .populate({
            path: "roles",
            select: "name -_id",
            //transform: doc => doc === null ? null : doc.name,
            populate: {
                path: "permissions",
                select: "name -_id",
                //transform: doc => doc === null ? null : doc.name,
            }
        }).select("+password") as AuthenticatedUser;// as AuthenticatedUser type conversion works when `.select("+password") is appended !!!
    if (!user) {
        throw new Error("User no longer exists");
    }

    // 4. Generate a new access token
    await sessionServices.deleteSessionByToken(refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    try {
        const refreshTokenData = jwt.verify(refreshToken, config.JWT_SECRET_REFRESH) as JwtPayload;
        const expiresAt = new Date(refreshTokenData.exp! * 1000);
        await sessionServices.createSession({
            userId: user.id,
            refreshToken,
            expiresAt
        });
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        //console.log(error);
        throw new Error("Failed to initialize session. Please try again.");
    }
};
export const logout = async (refreshToken: string) => {
    await sessionServices.deleteSessionByToken(refreshToken);
};
