// This route gets the most recently created node for a given tree
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GetTreeByHash, GetTreeByHashSchema } from "@/lib/validation_schemas";
import { z } from "zod";

/**
 * This route returns the most recently created node for a given tree.
 * @param request a request for this route that includes the treeHash query parameter
 * @returns a NextResponse with 200 status and the most recent node on success.
 */
export async function GET(request: NextRequest, { params }: { params: { treeHash: string } }) {
    try {
        // First we parse the input
        const { treeHash } = await params; // Got an error complaining about not awaiting for this, will look into it later
        const hash = GetTreeByHashSchema.parse({ hash: treeHash });

        // Then get the most recently made node
        const node = await prisma.node.findFirst({
            where: { tree: { hash: hash.hash } },
            orderBy: { createdAt: "desc" },
            take: 1,
        });

        return NextResponse.json({ node }, { status: 200 });
    } catch (err) {
        console.error("Error fetching latest node:", err);
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