import { z } from "zod";

export const objectId = z.string()
    .length(24, "Invalid Permission ID")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Permission ID");
export const IdSchema =  z.object({
    id: objectId,
});