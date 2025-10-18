// This file has all of the schemas that we expect from the frontend!
// Zod can grab the schemas from this file and use them to validate
// incoming requests at runtime

import { z } from 'zod';

// Schema for creating a new user
export const CreateUserSchema = z.object({
    name: z.string().min(1).max(30),
    email: z.email()
    // Oauth handles login so no password field
})

// We can export the type of the CreateUserSchema for use elsewhere
export type CreateUser = z.infer<typeof CreateUserSchema>;

// Schema for what we expect from prisma when getting a user
export const UserSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(30).optional().nullable(),
    email: z.email(),
    emailVerified: z.date().optional().nullable(),
    createdAt: z.coerce.date(),
    image: z.string().optional().nullable(),
    // Leaving these here for now, but prisma doesn't seem to return
    // them when we create a new user, although it might later?
    // accounts: z.array(z.any()),  // <--
    // sessions: z.array(z.any()),  // <-- Simplified for brevity
    // trees: z.array(z.any())      // <--
});

// We can export this too
export type User = z.infer<typeof UserSchema>;

// Schema for requesting a user by id
export const GetUserByIdSchema = z.object({
    id: z.string().min(1)
});
export type GetUserById = z.infer<typeof GetUserByIdSchema>;