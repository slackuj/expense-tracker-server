import mongoose from "mongoose";
import {Permission} from "../types/permission";

export interface IPermission extends Permission, mongoose.Document {}

const permissionSchema = new mongoose.Schema<IPermission>({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

export const PermissionModel = mongoose.model<IPermission>("Permission", permissionSchema);