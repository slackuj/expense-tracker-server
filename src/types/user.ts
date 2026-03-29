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

/*
YOU ALSO NEED TO CHECK ACCESS TOKEN, WHEN OPERATIONS ARE BEING CARRIED OUT VIA USER'S ACCOUNT.
THEREFORE, POSTPONED FOR NOW !!!
----> ALSO CONSIDER THE SCENARIO FOR DELETION !!!
type UserDataUpdateRequest =  Partial<Omit<UserRegisterRequest, 'password' | 'confirmPassword'>>;
type UsePasswordUpdateRequest = Pick<UserRegisterRequest, 'email' | 'password' | 'confirmPassword'>;*/
