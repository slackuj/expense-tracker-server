import {UserModel} from "../models/UserModel";
import * as sessionServices from "./sessionServices";

export const fetchAllUsers = async () => (
    await UserModel.find().exec()
);

export const fetchUserById = async (userId: string) => (
    await UserModel.findById(userId).exec()
);

export const deleteUserById = async (userId: string) => {
    await sessionServices.deleteSessionById(userId);
    await UserModel.findByIdAndDelete(userId).exec();
};