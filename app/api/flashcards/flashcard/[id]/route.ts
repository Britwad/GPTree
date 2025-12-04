// app/api/flashcards/flashcard/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateFlashcardSchema = z.object({
  name: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const flashcardIdString = params.id;
    const flashcardId = parseInt(flashcardIdString, 10);

    if (isNaN(flashcardId)) {
      return NextResponse.json(
        { error: "Invalid flashcard ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = UpdateFlashcardSchema.parse(body);

    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.flashcard.update({
      where: { id: flashcardId },
      data: {
        ...(parsed.name !== undefined && { name: parsed.name }),
        ...(parsed.content !== undefined && { content: parsed.content }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error updating flashcard:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { errors: err.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const flashcardIdString = params.id;
    const flashcardId = parseInt(flashcardIdString, 10);

    if (isNaN(flashcardId)) {
      return NextResponse.json(
        { error: "Invalid flashcard ID format" },
        { status: 400 }
      );
    }

    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    await prisma.flashcard.delete({
      where: { id: flashcardId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting flashcard:", err);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

