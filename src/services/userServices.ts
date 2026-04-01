import {UserModel} from "../models/UserModel";
import * as sessionServices from "./sessionServices";

export const fetchAllUsers = async () => (
    await UserModel.find().exec()
);

export const fetchUserById = async (userId: string) => {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const deleteUserById = async (userId: string) => {
    const user = await UserModel.findByIdAndDelete(userId).exec();
    if (!user) {
        throw new Error("User not found");
    }
    await sessionServices.deleteSessionsById(userId);
};