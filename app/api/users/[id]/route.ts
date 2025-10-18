// We use this route to get info about a user

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { GetUserById, GetUserByIdSchema } from "@/lib/validation_schemas";

// Get a user by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Read and parse the request
        const data: GetUserById = GetUserByIdSchema.parse(params);


        // Get the user
        const user = await prisma.user.findUnique({
            where: { id: data.id }
        });

        // Return the new user
        return NextResponse.json(user, { status: 200 });
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