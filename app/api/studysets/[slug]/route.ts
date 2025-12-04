// app/api/studysets/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateStudySetSchema = z.object({
  title: z.string().min(1),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const studyset = await prisma.studySet.findUnique({
      where: { slug },
      include: {
        flashcards: {
          select: { id: true, name: true, content: true, dueAt: true },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!studyset) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(studyset, { status: 200 });
  } catch (err) {
    console.error("Error fetching studyset:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const body = await request.json();
    const parsed = UpdateStudySetSchema.parse(body);

    const studyset = await prisma.studySet.findUnique({
      where: { slug },
    });

    if (!studyset) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.studySet.update({
      where: { slug },
      data: { title: parsed.title },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Error updating studyset:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const studyset = await prisma.studySet.findUnique({
      where: { slug },
    });

    if (!studyset) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.studySet.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting studyset:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
