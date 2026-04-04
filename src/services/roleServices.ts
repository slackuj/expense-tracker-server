import {CreateRoleRequest, EditRoleRequest} from "../types/role";
import {RoleModel} from "../models/RoleModel";
import {PermissionModel} from "../models/PermissionModel";

export const create = async (data: CreateRoleRequest) => {
    const existingRole = await RoleModel.exists({ name: data.name });

    if (existingRole) {
        throw new Error(`Role ${data.name} already exists!`);
    }

    // referential integrity check
    if (data.permissions && data.permissions.length > 0) {
        const count = await PermissionModel.countDocuments({ _id: { $in: data.permissions } });
        if (count !== data.permissions.length) {
            throw new Error("One or more Permission IDs are invalid.");
        }
    }
    return await (await RoleModel.create(data)).populate("permissions");
}

export const updateById = async (id: string, data: EditRoleRequest) => {
    // referential integrity check
    if (data.permissions && data.permissions.length > 0) {
        const count = await PermissionModel.countDocuments({ _id: { $in: data.permissions } });
        if (count !== data.permissions.length) {
            throw new Error("One or more Permission IDs are invalid.");
        }
    }
    const updatedRole =  await RoleModel.findByIdAndUpdate(
        id,
        data,
        { returnDocument: "after" }
    ).exec();

    if (!updatedRole) {
        throw new Error(`Role does not exists!`);
    }
    return updatedRole.populate("permissions");
};

export const deleteById = async (id: string) => {
    const deletedRole = await RoleModel.findByIdAndDelete(id).exec();
    if (!deletedRole) {
        throw new Error(`Role does not exists!`);
    }
}

export const getAll = async() => {
    return await RoleModel.find().populate("permissions").exec();
};

export const getById = async (id: string) => {
    return await RoleModel.findById(id).populate("permissions").exec();
}