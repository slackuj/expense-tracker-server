import {CreateRoleRequest, EditRoleRequest} from "../types/role";
import {RoleModel} from "../models/RoleModel";
import {PermissionModel} from "../models/PermissionModel";

export const create = async (data: CreateRoleRequest) => {
    const existingRole = await RoleModel.exists({ name: data.name });

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