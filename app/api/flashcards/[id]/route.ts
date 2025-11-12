// We use this route to get all flashcards by a node's ID
// The file path `[id]` here is treated as the `nodeId`
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    const nodeIdString = params.id;

    const nodeId = parseInt(nodeIdString, 10);

    if (isNaN(nodeId)) {
      return NextResponse.json(
        { error: "Invalid node ID format" },
        { status: 400 }
      );
    }

    const flashcards = await prisma.flashcard.findMany({
      where: {
        nodeId: nodeId,
      },
    });

    return NextResponse.json(flashcards, { status: 200 });
  } catch (err) {
    console.error("Error getting flashcards:", err);

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