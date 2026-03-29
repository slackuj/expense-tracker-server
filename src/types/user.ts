import mongoose from "mongoose";

export interface UserRegisterRequest  {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserSession {
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
}