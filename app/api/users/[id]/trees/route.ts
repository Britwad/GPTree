// We use this route to get the trees that a user has

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { GetByUserId, GetByUserIdSchema } from "@/lib/validation_schemas";

// Get a list of trees for a user
export async function GET(request: NextRequest, params: GetByUserId) {
    try {
        // Read and parse the request
        const data: GetByUserId = GetByUserIdSchema.parse(params);

        // Get the trees, and include the name and number of nodes for each
        const trees = await prisma.tree.findMany({
            where: { userId: data.id },
            select: {
                id: true,
                name: true,
                _count: {select: {nodes: true}}
            }
        });
        
        // Return the trees
        return NextResponse.json(trees, { status: 200 });
    } catch (err) {
        // If the error was in parsing, it's the client's fault: return 400
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { errors: z.flattenError(err) },
                { status: 400 }
            )}
        
        // Otherwise it's the server's fault: return 500
        // We might want to have other error cases later, like if prisma fails
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}