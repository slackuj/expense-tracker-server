import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
}

mongoose.plugin( schema => {
    schema.set("toJSON", {
        virtuals: true ,
        versionKey: false,
        transform: (_doc, ret) => {
            delete ret._id;
            return ret;
        }
    });
});

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
},
    { timestamps: true }
);

userSchema.post( /find/, (error: any, doc: any, next: any) => {
    if (!doc || error.name === "CastError") {
        return next(new Error("User not found"));
    }
    if (error) return next(error);
    next();
});

export const UserModel = mongoose.model<IUser>("User", userSchema);