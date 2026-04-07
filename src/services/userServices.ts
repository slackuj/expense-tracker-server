import {UserModel} from "../models/UserModel";
import * as sessionServices from "./sessionServices";
import {AuthenticatedUser, EditUserRolesRequest} from "../types/user";
import {RoleModel} from "../models/RoleModel";
import {generateAccessToken} from "../utils/authUtil";

export const fetchAllUsers = async () => (
    // filtering SUPER ADMIN's info to be fetched using super admin name 'slackuj'
    // hence SUPER ADMIN's name (i.e slackuj for now) should be hardcoded throughout the application strictly !!!

    await UserModel.find({ name: { $ne: "slackuj" } })
        .populate({
        path: "roles",
        select: "name -_id",
        transform: doc => doc === null ? null : doc.name
        //select: "name",
    }).exec()
);

export const fetchUserById = async (userId: string) => {
    const user = await UserModel.findOne({
        _id: userId,
        name: { $ne: "slackuj" } // do not allow to fetch SUPER ADMIN info
    })
        .populate({
            path: "roles",
            // explicitly remove _id
            select: "name -_id",
            // transforming populated data
            transform: doc => doc === null ? null : doc.name
            //select: "name",
        })
        .exec();
    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const deleteUserById = async (userId: string) => {
    const user = await UserModel.findOneAndDelete({
        name: { $ne: "slackuj" },// do not allow to delete SUPER ADMIN
        _id: userId
    }).exec();
    if (!user) {
        throw new Error("User not found");
    }
    await sessionServices.deleteSessionsById(userId);
};

export const updateUserRolesById = async (userId: string, data: EditUserRolesRequest, currentUserId: string) => {
    // prevent user from being promoted to SUPER ADMIN
    if (data.roles.includes("SUPER_ADMIN")) {
        throw new Error("Unauthorized: Promotion to SUPER ADMIN is prohibited.");
    }
    const roles = await RoleModel.find({ name: { $in: data.roles } });
    const roleIds = roles.map(r => r.id);
    if (roleIds.length !== data.roles.length) {
        throw new Error("One or more Roles are invalid.");
    }
    data.roles = roleIds;

    // findOneAndUpdate( filter, update, options )
    const updatedUser = await UserModel.findOneAndUpdate(
        {
            name: { $ne: "slackuj" }, // updating SUPER ADMIN's role is redundant
            _id: userId,
        },
        data,
        { returnDocument: "after" }
).exec();
    if (!updatedUser) {
        throw new Error(`Permission does not exists!`);
    }
    const updatedUserData =  await updatedUser.populate({
        path: "roles",
        select: "name -_id",
        transform: doc => doc === null ? null : doc.name,
        populate: {
            path: "permissions",
            select: "name -_id",
            transform: doc => doc === null ? null : doc.name
        }
    }) as AuthenticatedUser;

    const isSelfUpdate = userId === currentUserId;
    if (!isSelfUpdate) {
// kill old sessions to prevent user from using old roles and permissions as new access token cannot be provided to them when the update was carried out by admins !!!
        // DO NOT ENFORCE QUIC SYNC FOR NOW, JUST RELYING ON ACCESS TOKEN DEADLINE IS OKAY AS LONG AS GENERAL USERS ARE NOT PROVIDED AUTHORITY TO HANDLE SENSITIVE OPERATIONS
        //await sessionServices.deleteSessionsById(userId);
        return {
            // user(say admin) is updating another user's role
            // user(say admin) does not need new AccessToken
            updatedUserData,
        };
    } else {
        // user has permissions to update self roles
        // user needs new access token for synchronization
        const newAccessToken = generateAccessToken(updatedUserData);
        return {
            accessToken: newAccessToken,
            updatedUserData,
        };
    }
};