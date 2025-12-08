// app/api/studysets/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const CreateStudySetSchema = z.object({
  title: z.string().min(1),
  userId: z.string().optional(),
  flashcardIds: z.array(z.number().int().positive()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") ?? undefined;
    if (!userId) {
      return NextResponse.json({ error: "userId query required" }, { status: 400 });
    }

    const sets = await prisma.studySet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { flashcards: true },
        },
      },
    });

    return NextResponse.json({ studysets: sets }, { status: 200 });
  } catch (err) {
    console.error("Error fetching studysets:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateStudySetSchema.parse(body);

    // userId may come in body or query (body preferred)
    let userId = parsed.userId;
    if (!userId) {
      const url = new URL(request.url);
      userId = url.searchParams.get("userId") ?? undefined;
    }
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // create slug simple: lowercase kebab + short random suffix to reduce collisions
    const base = parsed.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const rand = Math.random().toString(36).slice(2, 7);
    const slug = `${base}-${rand}`;

    const studyset = await prisma.studySet.create({
      data: { title: parsed.title, slug, userId },
    });

    // Associate flashcards with the studyset if provided
    if (parsed.flashcardIds && parsed.flashcardIds.length > 0) {
      await prisma.flashcard.updateMany({
        where: {
          id: { in: parsed.flashcardIds },
          userId: userId, // Ensure user owns these flashcards
        },
        data: {
          studySetId: studyset.id,
        },
      });
    }

    return NextResponse.json(studyset, { status: 201 });
  } catch (err) {
    console.error("Error creating studyset:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
