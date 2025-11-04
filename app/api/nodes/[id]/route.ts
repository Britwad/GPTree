// We use this route to get a node by its ID
// Change this later to use node hash instead of ID

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
// import { GetNodeByHashSchema } from "@/lib/validation_schemas";

export async function GET(request: NextRequest, params: { id: number }) {
    try {
        // const parsed = GetNodeByHashSchema.parse(params);

        // At some point this code will need to be changed to use the node hash
        // get the node
        const node = await prisma.node.findUnique({
            where: {
                id: params.id
            }
        });

        return NextResponse.json(node, { status: 200 });
    } catch (err) {
        console.error("Error getting node:", err);

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
};