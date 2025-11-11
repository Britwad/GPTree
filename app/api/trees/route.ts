// We use this route to create a new tree for a user
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { 
    type CreateTree, 
    CreateTreeSchema,
    GetTreesSchema,
    type PaginatedTreesResponse, 
    type CreatedFlashcard
} from "@/lib/validation_schemas";
import {
    getGroqResponse,
    groqTeacherPrompt,
    groqRootPrompt,
    parseStructuredNode,
    generateFlashcards
 } from "@/backend_helpers/groq_helpers";

// Create a new tree for a user
export async function POST(request: NextRequest) {
    try {
        // Read and parse the request
        const body = await request.json();
        const data = CreateTreeSchema.parse(body) as CreateTree;

        // Generate content for the root node based on the prompt
        // We're streaming to the backend right now but eventually
        // we will stream to the client
        const stream = await getGroqResponse([
            { role: "system", content: groqTeacherPrompt },
            { role: "user", content: `Create a very broad overview for a topic tree on: ${data.prompt}. `
                    + groqRootPrompt }
        ]);
        let content = "";
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            content += decoder.decode(value);
        }

        // Parse and validate the content as a StructuredNode
        const parsedNode = parseStructuredNode(content);
        let stringContent: string;
        if (typeof parsedNode.content !== 'string') {
            stringContent = JSON.stringify(parsedNode.content);
        } else {
            stringContent = parsedNode.content;
        }

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
                    name: parsedNode.name,
                    question: data.prompt,
                    content: stringContent,
                    followups: parsedNode.followups,
                    treeId: newTree.id,
                    userId: data.userId,
                    parentId: null,
                },
            });

            return { tree: newTree, node: rootNode };
        });
        
        let flashcards: CreatedFlashcard[] = [];
        try {
        const flashcardData = await generateFlashcards({
            nodeName: created.node.name,
            nodeContent: stringContent,
        });

        if (flashcardData.length > 0) {
            const createdFlashcards = await prisma.$transaction(
            flashcardData.map((fc) =>
                prisma.flashcard.create({
                data: {
                    nodeId: created.node.id,
                    userId: data.userId,
                    name: fc.keyword,
                    content: fc.definition,
                },
                })
            )
            );

            flashcards = createdFlashcards.map((fc) => ({
            id: fc.id,
            keyword: fc.name,
            definition: fc.content,
            }));
        }
        } catch (e) {
        console.error("Root node flashcard generation error:", e);
        }

        return NextResponse.json(
        { tree: created.tree, node: created.node, flashcards },
        { status: 201 }
        );



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