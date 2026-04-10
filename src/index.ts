import express from "express";
import {connectDB} from "./configurations/db";
import cors from "cors";
import {config} from "./config";
import {errorHandler} from "./middlewares/errorHandler";
import {routes} from "./routes";
import cookieParser from "cookie-parser";

export const app = express();

connectDB();

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,// Allow cookies/headers to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.listen(config.PORT, () => {
    console.log(`Server started on port ${config.PORT}`);
});

app.use(cookieParser());
app.use("/api", routes);
app.use(errorHandler);