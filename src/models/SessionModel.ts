import mongoose from "mongoose";
import { UserSession } from "../types/user";

export interface ISession extends UserSession, mongoose.Document {}

mongoose.plugin( schema => {
    schema.set("toJSON", {
        virtuals: true ,
        versionKey: false,
        // check if it works without delete ret._id !!!
        /*transform: (_doc, ret) => {
            delete ret._id;
            return ret;
        }*/
    });
});

const sessionSchema = new mongoose.Schema<ISession>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
});

export const SessionModel = mongoose.model<ISession>("Session", sessionSchema);