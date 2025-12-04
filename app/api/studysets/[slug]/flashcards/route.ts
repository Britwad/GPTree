// app/api/studysets/[slug]/flashcards/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateFlashcardSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  userId: z.string().optional(),
  nodeId: z.number().int().positive(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const body = await request.json();
    const parsed = CreateFlashcardSchema.parse(body);

    // find study set
    const set = await prisma.studySet.findUnique({ where: { slug } });
    if (!set) return NextResponse.json({ error: "Study set not found" }, { status: 404 });

    const userId = parsed.userId ?? set.userId;

    const node = await prisma.node.findUnique({ where: { id: parsed.nodeId } });
    if (!node || node.userId !== userId) {
      return NextResponse.json({ error: "nodeId not found or does not belong to this user" }, { status: 400 });
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        name: parsed.name,
        content: parsed.content,
        studySetId: set.id,
        userId,
        nodeId: parsed.nodeId,
      },
    });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (err) {
    console.error("Error creating flashcard:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
