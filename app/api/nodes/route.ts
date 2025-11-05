import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma";
import { z } from "zod";
import { CreateNodeSchema, GetNodesSchema, StructuredNodeSchema } from "@/lib/validation_schemas";

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

function parseStructuredNode(content: string) {
    const trimmed = content.trim();
    const first = trimmed.indexOf('{');
    const last = trimmed.lastIndexOf('}');
    const jsonStr = first >= 0 && last > first ? trimmed.slice(first, last + 1) : trimmed;
    let parsed: unknown;

    try {
        parsed = JSON.parse(jsonStr);
    } catch (e) {
        throw new Error("Failed to parse node content as JSON");
    }
    const r = StructuredNodeSchema.safeParse(parsed);
    if (!r.success) {
        throw new Error("Parsed node content does not match expected schema");
    }
    return r.data;
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

        const seedPrompt = parsed.question ?? "";
        let nodeName = "";
        let nodeContent = "";
        let followups: string[] = [];

        if (seedPrompt.trim().length > 0) {
            const systemPrompt = `You are an expert that writes short node titles, detailed content, and follow-up user prompts.
                                 Respond with a single valid JSON object with keys: name, content, followups.
                                 - name: short title (3-7 words)
                                 - content: 1-3 paragraphs explaining the idea, include examples when helpful
                                 - followups: array of 1-6 short user-facing next-step prompts (3-12 words)
                                 Return JSON only, no markdown or commentary.`;

            const messages = [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Create a node for this prompt:\n\n${seedPrompt}\n\nContext: none` },
            ];

            try {
                const raw = await callGroqChat(messages);
                const structured = parseStructuredNode(raw);
                nodeName = structured.name;
                nodeContent = structured.content;
                followups = structured.followups;
            } catch (gErr: unknown) {
                console.error("Groq generation error:", gErr);

                const detail = gErr instanceof Error ? gErr.message : String(gErr);
                return NextResponse.json({ error: "Generation failed", detail }, { status: 502 });
            }
        } else {
            return NextResponse.json({ error: "seed prompt (question) is required" }, { status: 400 });
        }

        const data: Prisma.NodeUncheckedCreateInput = {
            name: nodeName,
            question: parsed.question,
            content: nodeContent,
            followups,
            treeId: parent.treeId,
            parentId: parent.id,
            userId: parsed.userId,
        };

        const created = await prisma.node.create({ data });

        return NextResponse.json({ node: created, followups }, { status: 201 });
    } catch (err: unknown) {
        console.error("POST /api/node error", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json({ errors: err.flatten() }, { status: 400 });
        }

        const detail = err instanceof Error ? err.message : "An unknown error occurred";
        return NextResponse.json({ error: "Internal Server Error", detail }, { status: 500 });
    }
}