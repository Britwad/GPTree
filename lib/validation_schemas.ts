// This file has all of the schemas that we expect from the frontend!
// Zod can grab the schemas from this file and use them to validate
// incoming requests at runtime

import { z, ZodObject } from 'zod';


export const CreateUserSchema = z.object({
    username: z.string().min(1).max(30),
    email: z.email()
    // Oauth handles login so no password field
})

// We can export the type of the CreateUserSchema for use elsewhere
export type CreateUser = z.infer<typeof CreateUserSchema>;

