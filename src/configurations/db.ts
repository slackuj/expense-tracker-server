import mongoose from "mongoose";
import { config } from "../config";

// global plugin
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

export const connectDB = async () => {
    try {
        // establish connection
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to DB");
    }
    catch(error) {
        console.log("Error connecting to DB: ", error);
        process.exit(1);
    }
}