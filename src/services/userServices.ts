import {UserModel} from "../models/UserModel";
import * as sessionServices from "./sessionServices";
import {EditUserRolesRequest} from "../types/user";
import {RoleModel} from "../models/RoleModel";
import {generateAccessToken} from "../utils/authUtil";

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

export const updateUserRolesById = async (userId: string, data: EditUserRolesRequest, currentUserId: string) => {
    const roles = await RoleModel.find({ name: { $in: data.roles } });
    const roleIds = roles.map(r => r.id);
    if (roleIds.length !== data.roles.length) {
        throw new Error("One or more Roles are invalid.");
    }
    data.roles = roleIds;
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        data,
        { returnDocument: "after" }
    ).exec();
    if (!updatedUser) {
        throw new Error(`Permission does not exists!`);
    }
    const updatedUserData =  await updatedUser.populate({
        path: "roles",
        select: "name",
        populate: {
            path: "permissions",
            select: "name"
        }
    });

    const isSelfUpdate = userId === currentUserId;
    if (!isSelfUpdate) {
// kill old sessions to prevent user from using old roles and permissions as new access token cannot be provided to them when the update was carried out by admins !!!
        // DO NOT ENFORCE QUIC SYNC FOR NOW, JUST RELYING ON ACCESS TOKEN DEADLINE IS OKAY AS LONG AS GENERAL USERS ARE NOT PROVIDED AUTHORITY TO HANDLE SENSITIVE OPERATIONS
        //await sessionServices.deleteSessionsById(userId);
        return {
            // admin does not need new AccessToken
            updatedUserData,
        };
    } else {
        // user needs new access token for synchronization
        const newAccessToken = generateAccessToken(updatedUserData);
        return {
            accessToken: newAccessToken,
            updatedUserData,
        };
    }
};