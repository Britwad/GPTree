// We use this route to create a new tree for a user
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { 
    type CreateTree, 
    CreateTreeSchema,
    GetTreesSchema,
    type PaginatedTreesResponse, 
    type CreatedFlashcard,
    CreateNode,
    InitTreeSchema,
    CreateOrInitTreeSchema
} from "@/lib/validation_schemas";
import {
    getGroqResponse,
    parseStructuredNode,
    generateFlashcards,
    nodeSystemPrompt,
    generateNodeStream,
 } from "@/backend_helpers/groq_helpers";

// Create the root node and flashcards for a user's new tree
export async function POST(request: NextRequest) {
    try {
        // Read and parse the request
        // We have to use SafeParse to check if we are initializing or creating with prompt
        const body = await request.json();
        const data_check = CreateOrInitTreeSchema.safeParse(body);
        if (!data_check.success) {
            throw data_check.error;
        }

        if (!("prompt" in data_check.data)) {
            // It's an init request
            const data = InitTreeSchema.parse(body);

            // Create the tree
            const created_tree = await prisma.tree.create({
                data: {
                    name: data.name,
                    userId: data.userId,
                }
            });

            // Now we just return it
            return NextResponse.json(created_tree, { status: 201 });
        }
        
        // Otherwise it must be a create with prompt request
        const data = CreateTreeSchema.parse(body);

        // Get the stream for the node generation
        const rootBody: CreateNode = {
            question: data.prompt,
            userId: data.userId,
            treeId: 0xDEADBEEF, // Come back to this later, I need to go eat food
            parentId: null,
        };
        const nodeStream = await generateNodeStream(
            data.prompt,
            rootBody
        );

        return new NextResponse(nodeStream, { status: 201 });
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