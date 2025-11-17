// This file has all of the schemas that we expect to deal with!
// Zod can grab the schemas from this file and use them to validate
// incoming requests at runtime

import { z } from 'zod';

import { type Node, type Tree as Prisma_Tree, type Flashcard } from '@/app/generated/prisma/client';

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
    prompt: z.string().min(1).max(500).optional(),
});
export type CreateTree = z.infer<typeof CreateTreeSchema>;

// Schema for initializing a tree without generating its content
// (we want this to help with some frontend navigation issues that come up with streaming)
export const InitTreeSchema = z.object({
    name: z.string().min(1).max(100),
    userId: z.string().min(1),
});
export type InitTree = z.infer<typeof InitTreeSchema>;

// We're also gonna need a union for creating and initializing trees
export const CreateOrInitTreeSchema = z.union([CreateTreeSchema, InitTreeSchema]);
export type CreateOrInitTree = z.infer<typeof CreateOrInitTreeSchema>;

// Schema for creating a new node   
export const CreateNodeSchema = z.object({
    question: z.string().min(1).max(500),
    userId: z.string().min(1),
    treeId: z.number().min(1),
    parentId: z.number().min(1).nullable(),
});
export type CreateNode = z.infer<typeof CreateNodeSchema>;

// Schema for what we expect from prisma when getting a tree
export const TreeSchema = z.object({
    name: z.string().min(1),
    id: z.number().min(1),
    createdAt: z.coerce.date(),
    userId: z.string().min(1),
    hash: z.string().min(1),
    updatedAt: z.coerce.date(),
});
export type Tree = z.infer<typeof TreeSchema>;

// Schema for a list of trees
export const TreeListSchema = z.array(z.object({
    id: z.number().min(1),
    name: z.string().min(1).max(100).optional().nullable(),
    _count: z.object({nodes: z.number().min(0)})
}));
export type TreeList = z.infer<typeof TreeListSchema>;

// Schema for getting a tree by its ID
export const GetTreeByHashSchema = z.object({
    hash: z.string().min(1)
});
export type GetTreeByHash = z.infer<typeof GetTreeByHashSchema>;
export type GetTreeByHashResponse = Prisma_Tree & { nodes: GetNodeByHashResponse[] };

// Schema for pagination parameters
export const PaginationParamsSchema = z.object({
    limit: z.number().int().min(1).max(100).optional().default(10),
    offset: z.number().int().min(0).optional().default(0),
});
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

// Schema for pagination metadata
export const PaginationMetadataSchema = z.object({
    total: z.number().int().min(0),
    limit: z.number().int().min(1),
    offset: z.number().int().min(0),
    hasMore: z.boolean(),
});
export type PaginationMetadata = z.infer<typeof PaginationMetadataSchema>;

// Schema for paginated trees response
export const PaginatedTreesResponseSchema = z.object({
    trees: z.array(TreeSchema),
    pagination: PaginationMetadataSchema,
});
export type PaginatedTreesResponse = z.infer<typeof PaginatedTreesResponseSchema>;

// Schema for getting trees with optional pagination
export const GetTreesSchema = z.object({
    userId: z.string().min(1),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
});
export type GetTrees = z.infer<typeof GetTreesSchema>;

// Schema for getting a node by its ID
export const GetNodeByHashSchema = z.object({
    hash: z.string().min(1)
});
export type GetNodeByHash = z.infer<typeof GetNodeByHashSchema>;
export type GetNodeByHashResponse = Node & {
    children: Node[],
    flashcards: Flashcard[]
};

export const GetFlashcardByNodeIDSchema = z.object({
    nodeId: z.number().min(1)
});
export type GetFlashcardByNodeID = z.infer<typeof GetFlashcardByNodeIDSchema>;

export const GetNodesSchema = z.object({
    treeHash: z.string().min(1).optional(),
    userId: z.string().min(1),
});
export type GetNodes = z.infer<typeof GetNodesSchema>;
export type GetNodesResponse = {
    nodes: Node[];
}

// Schema for the structured node returned by Groq
export const StructuredNodeSchema = z.object({
    status: z.enum(["success", "clarify"]),
    name: z.string().min(1),
    content: z.string().min(1),
    followups: z.array(z.string()).max(10),
});
export type StructuredNode = z.infer<typeof StructuredNodeSchema>;

export const FlashcardsSchema = z.array(
    z.object({
        keyword: z.string().min(1),
        definition: z.string().min(1),
    })
);
export type FlashcardInput = { keyword: string; definition: string };
export type CreatedFlashcard = {id: number; keyword: string; definition: string};

export const NodeSchema = z.object({
    question: z.string().min(1).max(500),
    userId: z.string().min(1),
    treeId: z.number().min(1),
    parentId: z.number().min(1).nullable(),
    name: z.string().min(1).max(200),
    id: z.number().min(1),
    content: z.string().min(1),
    followups: z.array(z.string()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type ValidationNode = z.infer<typeof NodeSchema>;