import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { z } from "zod";
import { CreateNodeSchema, GetNodesSchema, StructuredNodeSchema, CreatedFlashcard } from "@/lib/validation_schemas";
import { getGroqResponse, nodeSystemPrompt, generateNodeFields, parseStructuredNode, generateFlashcards } from "@/backend_helpers/groq_helpers";
import { id } from "zod/locales";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroqChat(messages: Array<{ role: string; content: string }>, model = 'compound-beta') {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not set");
    }

    const resp = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 500 }),
    });
    if (!resp.ok) {
        throw new Error(`GROQ API error: ${resp.status} ${resp.statusText}`);
    }
    const json = await resp.json();
    const content = json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.text;
    return content as string;
}

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = CreateNodeSchema.parse(body);

        const parent = await prisma.node.findUnique({ where: { id: parsed.parentId } });
        if (!parent) {
            return NextResponse.json({ error: "Parent node not found" }, { status: 404 });
        }

        const tree = await prisma.tree.findUnique({ where: { id: parent.treeId }, select: { userId: true } });
        if (!tree) return NextResponse.json({ error: "Tree not found" }, { status: 404 });
        if (tree.userId !== parsed.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const parsedNode = await generateNodeFields(parsed.question);

        const data: Prisma.NodeUncheckedCreateInput = {
            name: parsedNode.name,
            question: parsed.question,
            content: parsedNode.content,
            followups: parsedNode.followups,
            treeId: parent.treeId,
            parentId: parent.id,
            userId: parsed.userId,
        };

        const created = await prisma.node.create({ data });

        let flashcards: CreatedFlashcard[] = [];
        try {
            const flashcardData = await generateFlashcards({
                nodeName: created.name,
                nodeContent: nodeContent,
            });

            if (flashcardData.length > 0) {
                const createdFlashcards = await prisma.$transaction(
                    flashcardData.map((fc) =>
                        prisma.flashcard.create({
                            data: {
                                nodeId: created.id,
                                userId: parsed.userId,
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
            console.error("Flashcard generation error:", e);
        }

        return NextResponse.json(
            { node: created, followups, flashcards },
            { status: 201 }
        );
    } catch (err: unknown) {
        console.error("POST /api/node error", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json({ errors: err.flatten() }, { status: 400 });
        }

        const detail = err instanceof Error ? err.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", detail }, { status: 500 });
    }
}