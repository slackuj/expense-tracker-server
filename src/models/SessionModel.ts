import mongoose from "mongoose";
import { UserSession } from "../types/user";

export interface ISession extends UserSession, mongoose.Document {}

const sessionSchema = new mongoose.Schema<ISession>({
    userId: { type: String, ref: "User", required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
});

export const SessionModel = mongoose.model<ISession>("Session", sessionSchema);