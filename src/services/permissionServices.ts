import {CreatePermissionRequest, EditPermissionRequest} from "../types/permission";
import {PermissionModel} from "../models/PermissionModel";

export const create = async (data: CreatePermissionRequest) => {
    const { name, description } = data;
    const existingPermission = await PermissionModel.exists({ name });

    if (existingPermission) {
        throw new Error(`Permission ${name} already exists!`);
    }

    return await PermissionModel.create({ name, description });
};

export const updateById = async (id: string, data: EditPermissionRequest) => {
    const existingPermission = await PermissionModel.exists({ id });

    if (!existingPermission) {
        throw new Error(`Permission does not exists!`);
    }

    return await PermissionModel.findByIdAndUpdate(
        id,
        data,
    { returnDocument: "after" }
    ).exec();
};

export const deleteById = async (id: string) => {
    const existingPermission = await PermissionModel.exists({ id });
    if (!existingPermission) {
        throw new Error(`Permission does not exists!`);
    }
    await PermissionModel.findByIdAndDelete(id).exec();
}

export const getAll = async() => {
    return await PermissionModel.find().exec();
};

export const getById = async (id: string) => {
    return await PermissionModel.findById(id).exec();
}