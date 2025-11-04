// We use this route to get a tree by tree ID

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { type GetTreeByHash, GetTreeByHashSchema } from "@/lib/validation_schemas";

// Get a tree by tree ID
export async function GET(
    request: NextRequest,
    context: { params: { treeHash: string } }
) {
    try {
        // Read and parse the request
        const params = await Promise.resolve(context.params);
        const data: GetTreeByHash = GetTreeByHashSchema.parse({ hash: params.treeHash });

        // Find the tree with all its nodes and their relationships
        const newTree = await prisma.tree.findUnique({
            where: { hash: data.hash },
            include: {
                nodes: {
                    include: {
                        children: true,
                        flashcards: true
                    }
                }
            }
        });

        // Return the new tree
        return NextResponse.json(newTree, { status: 200 });
    } catch (err) {
        console.error("Error getting tree:", err);

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