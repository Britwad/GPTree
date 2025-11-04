// We use this route to get a tree by tree ID
// (note that we're using GetByUserID for now because
//  it works with our schema for now, but once we get a
//  few trees in our db to see what the ID's look like)

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
        const params = await Promise.resolve(context.params);
        // Read and parse the request
        const data: GetTreeByHash = GetTreeByHashSchema.parse({ hash: params.treeHash });

        // Find the tree with all its nodes and their relationships
        const tree = await prisma.tree.findUnique({
            where: { hash: data.hash },
            include: {
                nodes: {
                    include: {
                        flashcards: true
                    }
                }
            }
        });

        if (!tree) {
            return NextResponse.json(
                { error: 'Tree not found' },
                { status: 404 }
            );
        }

        // Build nested children structure manually
        const nodeMap = new Map();
        let rootNode: any = null;

        // First pass: create a map of all nodes
        tree.nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] });
        });

        // Second pass: build parent-child relationships
        tree.nodes.forEach(node => {
            const nodeWithChildren = nodeMap.get(node.id);
            if (node.parentId === null) {
                rootNode = nodeWithChildren;
            } else {
                const parent = nodeMap.get(node.parentId);
                if (parent) {
                    parent.children.push(nodeWithChildren);
                }
            }
        });

        // Return tree with single root node containing nested children
        const treeWithNestedNodes = {
            ...tree,
            nodes: rootNode ? [rootNode] : []
        };

        return NextResponse.json(treeWithNestedNodes, { status: 200 });
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