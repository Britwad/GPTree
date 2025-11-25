import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { DeleteNodeSchema } from "@/lib/validation_schemas";

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const nodeId = parseInt(params.id, 10);

    if (isNaN(nodeId)) {
      return NextResponse.json(
        { error: "Invalid node ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = DeleteNodeSchema.parse(body);
    const { deleteMode, userId } = parsed;

    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: { children: true, tree: true },
    });

    if (!node) {
      return NextResponse.json(
        { error: `Node with id ${nodeId} not found` },
        { status: 404 }
      );
    }

    // Verify user owns this node
    if (node.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if this is a root node (no parent)
    if (!node.parentId) {
      // Delete the entire tree and all its nodes
      // First, recursively delete all nodes to ensure flashcards are cleaned up
      const deleteNodeAndChildren = async (id: number): Promise<void> => {
        const nodeToDelete = await prisma.node.findUnique({
          where: { id },
          include: { children: true },
        });

        if (nodeToDelete) {
          // Delete all flashcards for this node first
          await prisma.flashcard.deleteMany({
            where: { nodeId: id },
          });

          // Recursively delete all children
          for (const child of nodeToDelete.children) {
            await deleteNodeAndChildren(child.id);
          }
          // Delete the node itself
          await prisma.node.delete({
            where: { id },
          });
        }
      };

      // Delete all nodes in the tree
      await deleteNodeAndChildren(nodeId);

      // Now delete the tree
      await prisma.tree.delete({
        where: { id: node.treeId },
      });
      return NextResponse.json(
        { message: "Tree deleted successfully" },
        { status: 200 }
      );
    }

    // For non-root nodes
    if (deleteMode === "branch") {
      // Delete the node and all its children (recursively)
      const deleteNodeAndChildren = async (id: number): Promise<void> => {
        const nodeToDelete = await prisma.node.findUnique({
          where: { id },
          include: { children: true },
        });

        if (nodeToDelete) {
          // Delete all flashcards for this node first
          await prisma.flashcard.deleteMany({
            where: { nodeId: id },
          });

          // Recursively delete all children
          for (const child of nodeToDelete.children) {
            await deleteNodeAndChildren(child.id);
          }
          // Delete the node itself
          await prisma.node.delete({
            where: { id },
          });
        }
      };

      await deleteNodeAndChildren(nodeId);
      return NextResponse.json(
        { message: "Branch deleted successfully" },
        { status: 200 }
      );
    } else {
      // deleteMode === "node" - delete just the node and stitch children to parent
      // Delete all flashcards for this node first
      await prisma.flashcard.deleteMany({
        where: { nodeId: nodeId },
      });

      await prisma.node.updateMany({
        where: { parentId: nodeId },
        data: { parentId: node.parentId },
      });

      await prisma.node.delete({
        where: { id: nodeId },
      });

      return NextResponse.json(
        { message: "Node deleted and children stitched to parent" },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error(`Error deleting node:`, err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { errors: err.flatten() },
        { status: 400 }
      );
    }

    const detail = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", detail },
      { status: 500 }
    );
  }
}