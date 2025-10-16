// We use this route to create users
// (Maybe also use it to get a list of users later)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { CreateUserSchema, CreateUser } from "@/lib/validation_schemas";

// Create a new user
export async function POST(req: NextRequest) {
    try {
        // Read and parse the request
        const body = await req.json();
        const data: CreateUser = CreateUserSchema.parse(body);

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                name: data.username,
                email: data.email
                // We may need to add email verification here later
            }
        });

        // Return the new user
        return NextResponse.json(newUser, { status: 201});
    } catch (err) {
        // If the error was in parsing, it's the client's fault: return 400
        if (err instanceof z.ZodError) {
            const issues = err
            return NextResponse.json(
                { errors: err.issues},
                { status: 400}
            )}
        
        // Otherwise it's the server's fault: return 500
        // We might want to have other error cases later, but it's fine for now


    }
}