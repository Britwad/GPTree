import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let nodeId: number;

  try {
    const params = await context.params;
    const nodeIdString = params.id;
    nodeId = parseInt(nodeIdString, 10);

    if (isNaN(nodeId)) {
      return NextResponse.json(
        { error: "Invalid node ID format" },
        { status: 400 }
      );
    }

    const node = await prisma.node.findUnique({
      where: {
        id: nodeId,
      },
    });

    if (!node) {
      return NextResponse.json(
        { error: `Node with id ${nodeId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(node, { status: 200 });
  } catch (err) {
    console.error(`Error getting node:`, err);

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