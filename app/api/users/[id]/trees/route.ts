import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const trees = await prisma.tree.findMany({
      where: { userId: userId },
      select: {
        id: true,
        name: true,
        _count: { select: { nodes: true } },
      },
    });

    return NextResponse.json(trees, { status: 200 });
  } catch (err) {
    console.error("Error getting trees:", err);

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