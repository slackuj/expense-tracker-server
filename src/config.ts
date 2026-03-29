import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("17190").transform(Number),
    MONGO_URI: z.url("MONGO_URI must be a valid URL"),
    JWT_SECRET_ACCESS: z.string().min(32, "JWT_SECRET should be at least 32 characters for security"),
    JWT_SECRET_REFRESH: z.string().min(32, "JWT_SECRET should be at least 32 characters for security"),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
    console.error("❌ Invalid environment variables:", z.prettifyError(envServer.error));
    process.exit(1);
}

export const config = envServer.data;