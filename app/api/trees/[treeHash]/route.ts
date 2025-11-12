import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { type GetTreeByHash, GetTreeByHashSchema } from "@/lib/validation_schemas";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ treeHash: string }> }
) {
  try {
    const params = await context.params;
    const data: GetTreeByHash = GetTreeByHashSchema.parse({ hash: params.treeHash });

    const tree = await prisma.tree.findUnique({
      where: { hash: data.hash },
      include: {
        nodes: {
          include: {
            flashcards: true
          }
        }
      }
    });

    if (!tree) {
      return NextResponse.json(
        { error: 'Tree not found' },
        { status: 404 }
      );
    }

    const nodeMap = new Map();
    let rootNode: any = null;

    tree.nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    tree.nodes.forEach(node => {
      const nodeWithChildren = nodeMap.get(node.id);
      if (node.parentId === null) {
        rootNode = nodeWithChildren;
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(nodeWithChildren);
        }
      }
    });

    const treeWithNestedNodes = {
      ...tree,
      nodes: rootNode ? [rootNode] : []
    };

    return NextResponse.json(treeWithNestedNodes, { status: 200 });
  } catch (err) {
    console.error("Error getting tree:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { errors: err.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}