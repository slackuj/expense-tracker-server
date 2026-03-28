import mongoose from "mongoose";
import { config } from "../config";

export const connectDB = async () => {
    try {
        if (!config.MONGO_URI) {
            console.error("MONGO_URI is not defined");
            process.exit(1);
        }

        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to DB");
    }
    catch(error) {
        console.log("Error connecting to DB: ", error);
        process.exit(1);
    }
}