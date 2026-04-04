import mongoose from "mongoose";
import {Permission} from "../types/permission";
import {Role} from "../types/role";
import {IPermission} from "./PermissionModel";

export interface IRole extends Role, mongoose.Document {}

const roleSchema = new mongoose.Schema<IRole>({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    permissions:[{
        type: String,
        ref: "Permission"
    }]
}, {
    timestamps: true,
});

export const RoleModel = mongoose.model<IRole>("Role", roleSchema);