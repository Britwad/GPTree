// We use this route to create a new node under a parent node

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { CreateNodeSchema, GetNodesSchema } from "@/lib/validation_schemas";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const treeHash = searchParams.get('treeHash');
        const userId = searchParams.get('userId');

        // Build the query parameters object
        const queryParams: { treeHash?: string; userId?: string } = {};
        if (treeHash) queryParams.treeHash = treeHash;
        if (userId) queryParams.userId = userId;

        // Validate using GetNodesSchema
        const parsed = GetNodesSchema.parse(queryParams);

        // Build where clause
        const where: { tree?: { hash: string; userId: string } | { userId: string } } = {};

        where.tree = parsed.treeHash ? {
            hash: parsed.treeHash,
            userId: parsed.userId
        } : {
            userId: parsed.userId
        };

        // Fetch nodes from database, if treeHash provided the first node is root.
        const nodes = await prisma.node.findMany({
            where,
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json({ nodes }, { status: 200 });
    } catch (err) {
        console.error("GET /api/nodes error", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { errors: err.flatten() },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const parsed = CreateNodeSchema.parse(body);

        // check if parent exists
        const parent = await prisma.node.findUnique({ where: { id: parsed.parentId } });
        if (!parent) {
            return NextResponse.json(
                { error: "Parent node not found" },
                { status: 404 }
            );
        }

        // check this is user's node
        if (parsed.userId) {
            const tree = await prisma.tree.findUnique({ where: { id: parent.treeId }, select: { userId: true } });
            if (!tree) return NextResponse.json({ error: "Tree not found" }, { status: 404 });
            if (tree.userId !== parsed.userId) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 403 }
                );
            }
        }

        // create the new node
        const created = await prisma.node.create({
            data: {
                name: "",
                question: parsed.question,
                content: "",
                followups: [],
                treeId: parent.treeId,
                parentId: parent.id,
                userId: parsed.userId,
            },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        console.error("POST /api/node error", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { errors: z.flattenError(err) },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};