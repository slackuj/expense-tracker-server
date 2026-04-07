import {CreateRoleRequest, EditRoleRequest} from "../types/role";
import {RoleModel} from "../models/RoleModel";
import {PermissionModel} from "../models/PermissionModel";
import {UserModel} from "../models/UserModel";
import * as sessionServices from "./sessionServices";

export const create = async (data: CreateRoleRequest) => {
    const existingRole = await RoleModel.exists({ name: data.name });

    // what about catching error when role is duplicated and throwing corresponding error, as role name already set to unique in RoleModel !?
    if (existingRole) {
        throw new Error(`Role ${data.name} already exists!`);
    }

    // checking referential integrity and converting [permission names] into [permission IDs]
    if (data.permissions && data.permissions.length > 0) {
        const permissions = await PermissionModel.find({ name: { $in: data.permissions } });
        const permissionIds = permissions.map(p => p.id);
        if (permissionIds.length !== data.permissions.length) {
            throw new Error("One or more Permissions are invalid.");
        }
        data.permissions = permissionIds;
    }
    return await (await RoleModel.create(data)).populate("permissions");
}

export const updateById = async (id: string, data: EditRoleRequest) => {
    // checking referential integrity and converting [permission names] into [permission IDs]
    if (data.permissions && data.permissions.length > 0) {
        const permissions = await PermissionModel.find({ name: { $in: data.permissions } });
        const permissionIds = permissions.map(p => p.id);
        if (permissionIds.length !== data.permissions.length) {
            throw new Error("One or more Permissions are invalid.");
        }
        data.permissions = permissionIds;
    }
    const updatedRole =  await RoleModel.findOneAndUpdate(
        {
            name: { $ne: "SUPER_ADMIN" },// updating SUPER ADMIN role is redundant
            id
        },
        data,
        { returnDocument: "after" }
    ).exec();

    if (!updatedRole) {
        throw new Error(`Role does not exists!`);
    }
        return updatedRole.populate("permissions");
};

export const deleteById = async (id: string) => {
    const deletedRole = await RoleModel.findOneAndDelete({
        name: { $ne: "SUPER_ADMIN" },// do not allow to delete SUPER ADMIN role
        id
    }).exec();
    if (!deletedRole) {
        throw new Error(`Role does not exists!`);
    }
};

export const getAll = async() => {
    return await RoleModel.find()
        .populate({
            path: "permissions",
            select: "name -_id",
            transform: doc => doc === null ? null : doc.name,
        })
        .exec();
};

export const getById = async (id: string) => {
    return await RoleModel.findById(id).populate({
            path: "permissions",
            select: "name -_id",
            transform: doc => doc === null ? null : doc.name,
        })
        .exec();
}