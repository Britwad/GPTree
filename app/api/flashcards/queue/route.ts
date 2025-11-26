// app/api/flashcards/queue/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Flashcard } from "@/app/generated/prisma";


function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function priorityScore(card: {
  dueAt: string | Date;
  easeFactor?: number;
  lapses?: number;
}) {
  const now = new Date();
  const due = card.dueAt ? new Date(card.dueAt) : now;

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysOverdue = Math.floor((now.getTime() - due.getTime()) / msPerDay);

  const ef = typeof card.easeFactor === "number" ? card.easeFactor : 2.5;
  const lapses = typeof card.lapses === "number" ? card.lapses : 0;


  const wOverdue = 10;
  const wEF = 5;
  const wLapses = 2;

  const score = (Math.max(0, daysOverdue) * wOverdue)
    + ((1 / ef) * wEF)
    + (lapses * wLapses);

  return score + Math.random() * 0.0001;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const limit = Number(url.searchParams.get("limit") || 50);
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const now = new Date();
    const dueNow = await prisma.flashcard.findMany({
      where: { userId, suspended: false, dueAt: { lte: now } },
      take: limit * 3
    });

    const dueNowIds = dueNow.map((c) => c.id);

    let newItems: Flashcard[] = [];
    if (dueNow.length < limit) {
      newItems = await prisma.flashcard.findMany({
        where: {
          userId,
          suspended: false,
          repetition: 0,
          // exclude any ids already in dueNow
          NOT: dueNowIds.length ? { id: { in: dueNowIds } } : undefined,
        },
        take: limit - dueNow.length,
      });
    }

    const merged = [...dueNow, ...newItems].map((c) => {
      return { card: c, score: priorityScore(c) };
    });

    merged.sort((a, b) => b.score - a.score);

    const cards = merged.slice(0, limit).map((x) => x.card);

    return NextResponse.json({ cards });
  } catch (err) {
    console.error("queue route error:", err);
    return NextResponse.json({ error: String((err as Error)?.message ?? err) }, { status: 500 });
  }
}
