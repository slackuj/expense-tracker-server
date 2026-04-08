import {CreatePermissionRequest, EditPermissionRequest} from "../types/permission";
import {PermissionModel} from "../models/PermissionModel";

export const create = async (data: CreatePermissionRequest) => {
    const existingPermission = await PermissionModel.exists({ name: data.name });

    if (existingPermission) {
        throw new Error(`Permission ${data.name} already exists!`);
    }

    return await PermissionModel.create(data);
};

export const updateById = async (id: string, data: EditPermissionRequest) => {
    const updatedPermission = await PermissionModel.findByIdAndUpdate(
        id,
        data,
    { returnDocument: "after" }
    ).exec();
    if (!updatedPermission) {
        throw new Error(`Permission does not exists!`);
    }
    return updatedPermission;
};

export const deleteById = async (id: string) => {
    const deletedPermission= await PermissionModel.findByIdAndDelete(id).exec();
    if (!deletedPermission) {
        throw new Error(`Permission does not exists!`);
    }
}

export const getAll = async() => {
    return await PermissionModel.find().sort({ name: 1, _id: 1 })
        .exec();
};

export const getById = async (id: string) => {
    return await PermissionModel.findById(id).exec();
}