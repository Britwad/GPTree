// app/api/studysets/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const studyset = await prisma.studySet.findUnique({
      where: { slug },
      include: {
        flashcards: { take: 50, select: { id: true, name: true, content: true, dueAt: true } },
      },
    });

    if (!studyset) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(studyset, { status: 200 });
  } catch (err) {
    console.error("Error fetching studyset:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
