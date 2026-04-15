import mongoose from "mongoose";
import {otpExpiryDate} from "../constants/authConstants";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    roles: string[];// array of role IDs
}

export interface IUnconfirmedUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    confirmationCode: number;
    expiresAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    roles: [ {type: String, ref: "Role"} ],
},
    { timestamps: true }
);

const unConfirmedUserSchema = new mongoose.Schema<IUnconfirmedUser>({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        confirmationCode: { type: Number, required: true },
        expiresAt: { type: Date, default: otpExpiryDate, expires: 0 },
    },
    { timestamps: true }
);

/*userSchema.post( /find/, (error: any, doc: any, next: any) => {
    if (!doc || error.name === "CastError") {
        return next(new Error("User not found"));
    }
    if (error) return next(error);
    next();
});*/

export const UserModel = mongoose.model<IUser>("User", userSchema);
export const UnConfirmedUserModel = mongoose.model<IUnconfirmedUser>("UnConfirmedUser", unConfirmedUserSchema);
