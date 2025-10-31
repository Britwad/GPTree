// This file has all of the schemas that we expect to deal with!
// Zod can grab the schemas from this file and use them to validate
// incoming requests at runtime

import { z } from 'zod';

import { type Node, type Tree, type Flashcard } from '@/app/generated/prisma/client';


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
    name: z.string().min(1).max(30).nullable(),
    email: z.email(),
    emailVerified: z.date().nullable(),
    createdAt: z.coerce.date(),
    image: z.string().nullable(),
});
// We can export this too
export type User = z.infer<typeof UserSchema>;

// Schema for requesting something by user id
export const GetByUserIdSchema = z.object({
    id: z.string().min(1)
});
export type GetByUserId = z.infer<typeof GetByUserIdSchema>;

// Schema for creating a new tree
export const CreateTreeSchema = z.object({
    name: z.string().min(1).max(100),
    userId: z.string().min(1),
    prompt: z.string().min(1).max(500)
});
export type CreateTree = z.infer<typeof CreateTreeSchema>;

// Schema for creating a new node   
export const CreateNodeSchema = z.object({
    question: z.string().min(1).max(500),
    userId: z.string().min(1),
    treeId: z.number().min(1),
    parentId: z.number().min(1),
});
export type CreateNode = z.infer<typeof CreateNodeSchema>;

// Schema for a list of trees
export const TreeListSchema = z.array(z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(100).optional().nullable(),
    _count: z.object({node: z.number().min(0)})
}));
export type TreeList = z.infer<typeof TreeListSchema>;

// Schema for getting a tree by its ID
export const GetTreeByHashSchema = z.object({
    hash: z.string().min(1)
});
export type GetTreeByHash = z.infer<typeof GetTreeByHashSchema>;
export type GetTreeByHashResponse = Tree & { nodes: GetNodeByHashResponse[] };

// Schema for getting a tree by its ID
export const GetNodeByHashSchema = z.object({
    hash: z.string().min(1)
});
export type GetNodeByHash = z.infer<typeof GetNodeByHashSchema>;
export type GetNodeByHashResponse = Node & {
    children: Node[],
    flashcards: Flashcard[]
};