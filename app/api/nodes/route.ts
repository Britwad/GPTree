import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { z } from "zod";
import { CreateNodeSchema, GetNodesSchema, StructuredNodeSchema, CreatedFlashcard, CreateNode } from "@/lib/validation_schemas";
import { generateNodeStream } from "@/backend_helpers/groq_helpers";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const parsedQuery = GetNodesSchema.parse({
            treeHash: searchParams.get("treeHash") ?? undefined,
            userId: searchParams.get("userId") ?? undefined,
        });
        if (!parsedQuery.userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        const treeFilter: { userId: string; hash?: string } = {
            userId: parsedQuery.userId,
        };
        if (parsedQuery.treeHash) {
            treeFilter.hash = parsedQuery.treeHash;
        }

        const where = { tree: treeFilter };
        const nodes = await prisma.node.findMany({
            where,
            orderBy: { createdAt: "asc" },
            include: { flashcards: true },
        });

        return NextResponse.json({ nodes }, { status: 200 });
    } catch (err: unknown) {
        console.error("GET /api/nodes error", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json({ errors: err.flatten() }, { status: 400 });
        }

        const detail = err instanceof Error ? err.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", detail }, { status: 500 });
    }
}

/**
 * This route creates a new node in a tree, streaming the content as it is generated.
 * @param request a request for this route that has the data for a {@link CreateNode}
 * @returns a NextResponse with 201 status and a ReadableStream of the node content on success,
 * or an error message with appropriate status code on failure.
 */
export async function POST(request: NextRequest) {
    try {
        // First we parse the input
        const body = await request.json();
        const parsed = CreateNodeSchema.parse(body);

        // We'll put the stream in this variable later
        let nodeStream: ReadableStream<Uint8Array>;

        // Now we need to validate some things about the input:
        if (parsed.parentId) {
            // The parent must exist for non root nodes
            const parent = await prisma.node.findUnique({ where: { id: parsed.parentId } });
            if (!parent) {
                return NextResponse.json({ error: "Parent node not found" }, { status: 404 });
            }

            // The user must own the tree that the parent belongs to
            const userId = await prisma.tree.findUnique({ where: { id: parent.treeId }, select: { userId: true } });
            if (!userId) return NextResponse.json({ error: "Tree not found" }, { status: 404 });
            if (userId.userId !== parsed.userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }
            
            // Now we can set up the call to get a stream from our LLM,
            // which is simple if this isn't a root node
            nodeStream = await generateNodeStream(
                parsed.question,
                parsed
            );
        } else {
            // For root nodes, we need to verify that the user owns the tree
            const tree_info = await prisma.tree.findUnique({ where: { id: parsed.treeId }, select: { userId: true, name: true } });
            if (!tree_info) return NextResponse.json({ error: "Tree not found" }, { status: 404 });
            if (tree_info.userId !== parsed.userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            // Now we can set up the call to get a stream from our LLM
            nodeStream = await generateNodeStream(
                tree_info.name,
                parsed
            );
        }

        // Now we just pass that stream to the client
        return new NextResponse(nodeStream, { status: 201 });
    } catch (err: unknown) {
        console.error("POST /api/node error", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json({ errors: z.treeifyError(err) }, { status: 400 });
        }

        const detail = err instanceof Error ? err.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", detail }, { status: 500 });
    }
}