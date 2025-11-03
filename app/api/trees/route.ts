// We use this route to create a new tree for a user

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { 
    type CreateTree, 
    CreateTreeSchema,
    GetTreesSchema,
    type PaginatedTreesResponse 
} from "@/lib/validation_schemas";

// Create a new tree for a user
export async function POST(request: NextRequest) {
    try {
        // Read and parse the request
        const body = await request.json();
        const data = CreateTreeSchema.parse(body) as CreateTree;
        

        // Create the tree
        const created = await prisma.$transaction(async (tx) => {
            const newTree = await tx.tree.create({
                data: {
                    name: data.name,
                    userId: data.userId,
                }
            });
            
            // Create the Root Node
            const rootNode = await tx.node.create({
                data: {
                    name: "root",
                    question: data.prompt,
                    content: "",
                    followups: [],
                    treeId: newTree.id,
                    parentId: null,
                },
            });

            return { tree: newTree, node: rootNode };
        });
        
        // Return the new tree and node
        const res = JSON.parse(JSON.stringify(created));
        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        console.error("Error creating tree:", err);
        // If the error was in parsing, it's the client's fault: return 400

        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { errors: z.flattenError(err) },
                { status: 400 }
            );
        }

        // Otherwise it's the server's fault: return 500
        // We might want to have other error cases later, like if prisma fails
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const limitParam = url.searchParams.get('limit');
        const offsetParam = url.searchParams.get('offset');

        // Validate using schema
        const params = GetTreesSchema.parse({
            userId: userId || undefined,
            limit: limitParam ? parseInt(limitParam, 10) : undefined,
            offset: offsetParam ? parseInt(offsetParam, 10) : undefined,
        });

        // Use defaults from schema
        const limit = params.limit ?? 10;
        const offset = params.offset ?? 0;

        // Get total count for pagination metadata
        const totalCount = await prisma.tree.count({
            where: { userId: params.userId }
        });

        // Fetch paginated trees
        const trees = await prisma.tree.findMany({
            where: { userId: params.userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        // Return trees with pagination metadata
        const response: PaginatedTreesResponse = {
            trees,
            pagination: {
                total: totalCount,
                limit,
                offset,
                hasMore: offset + limit < totalCount,
            }
        };

        return NextResponse.json(response, { status: 200 });
    } catch (err) {
        console.error("Error fetching trees:", err);
        
        // If the error was in parsing, it's the client's fault: return 400
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { errors: err.flatten() },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}