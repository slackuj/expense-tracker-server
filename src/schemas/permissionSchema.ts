import { z } from 'zod';
import {objectId} from "./globalSchema";

export const CreatePermissionSchema =  z.object({
    name: z.string().min(5),
    description: z.string().min(10),
});

export const UpdatePermissionSchema =  CreatePermissionSchema.partial();