import { z } from 'zod';
import {objectId} from "./globalSchema";

export const CreateRoleSchema =  z.object({
    name: z.string().min(5),
    description: z.string().min(10),
    permissions: objectId.array().optional(),
});

export const UpdateRoleSchema =  CreateRoleSchema.partial();