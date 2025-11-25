// app/api/studysets/[slug]/next/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * Purpose:
 * - POST: Accepts { userId, count? } in body (or userId via query) and returns the next N cards for the studyset identified by slug.
 * - GET: Accepts ?userId=... and returns some default list (useful for quick debug).
 *
 * This file strictly avoids `any`:
 * - request.json() -> cast to unknown -> validated with Zod
 * - typed params shape
 * - explicit return type Promise<NextResponse>
 */

/* ========== Zod schema for incoming POST body ========== */
const NextBodySchema = z.object({
  userId: z.string().min(1),
  count: z.number().int().positive().optional(),
});

type NextBody = z.infer<typeof NextBodySchema>;

/* ========== typed shape for the route params ========== */
type Params = { params: { slug: string } };

/* ========== typed card payload returned to client ========== */
type CardPayload = {
  id: number;
  name: string;
  content: string;
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string; // ISO string
  lastReviewedAt: string | null;
};

/* ========== helper: pickNext (pure, typed) ========== */
function pickNext(cards: CardPayload[], count = 10): CardPayload[] {
  const now = Date.now();

  const due = cards.filter((c) => new Date(c.dueAt).getTime() <= now);
  const never = cards.filter((c) => c.repetition === 0 && new Date(c.dueAt).getTime() <= now);
  const others = cards.filter((c) => !due.includes(c) && !never.includes(c));

  due.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  others.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const out: CardPayload[] = [];
  out.push(...due.slice(0, count));
  if (out.length < count) out.push(...shuffle(never).slice(0, count - out.length));
  if (out.length < count) out.push(...others.slice(0, count - out.length));
  return out.slice(0, count);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ========== POST handler ========== */
export async function POST(request: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    // parse + validate body safely (no any)
    const raw = (await request.json()) as unknown;
    const parsed = NextBodySchema.parse(raw) as NextBody;

    // allow fallback userId via query param
    const url = new URL(request.url);
    const userIdFromQuery = url.searchParams.get("userId") ?? undefined;
    const userId = parsed.userId ?? userIdFromQuery;
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const count = parsed.count ?? 10;

    // Find studyset by slug
    const set = await prisma.studySet.findUnique({ where: { slug } });
    if (!set) {
      return NextResponse.json({ error: "StudySet not found" }, { status: 404 });
    }

    // Fetch candidate flashcards for that set and user
    // Select only fields we need and map to CardPayload
    const rawCards = await prisma.flashcard.findMany({
      where: { studySetId: set.id, userId },
      select: {
        id: true,
        name: true,
        content: true,
        repetition: true,
        intervalDays: true,
        easeFactor: true,
        dueAt: true,
        lastReviewedAt: true,
      },
    });

    const cards: CardPayload[] = rawCards.map((c) => ({
      id: c.id,
      name: c.name,
      content: c.content,
      repetition: c.repetition ?? 0,
      intervalDays: c.intervalDays ?? 0,
      easeFactor: c.easeFactor ?? 2.5,
      dueAt: c.dueAt instanceof Date ? c.dueAt.toISOString() : new Date(c.dueAt).toISOString(),
      lastReviewedAt: c.lastReviewedAt ? (c.lastReviewedAt instanceof Date ? c.lastReviewedAt.toISOString() : new Date(c.lastReviewedAt).toISOString()) : null,
    }));

    const next = pickNext(cards, count);

    return NextResponse.json({ cards: next }, { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/studysets/[slug]/next:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ========== GET handler (debug / convenience) ========== */
export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const set = await prisma.studySet.findUnique({ where: { slug } });
    if (!set) return NextResponse.json({ error: "StudySet not found" }, { status: 404 });

    const rawCards = await prisma.flashcard.findMany({
      where: { studySetId: set.id, userId },
      orderBy: { dueAt: "asc" },
      take: 20,
      select: {
        id: true,
        name: true,
        content: true,
        dueAt: true,
      },
    });

    const cards = rawCards.map((c) => ({
      id: c.id,
      name: c.name,
      content: c.content,
      dueAt: c.dueAt instanceof Date ? c.dueAt.toISOString() : new Date(c.dueAt).toISOString(),
    }));

    return NextResponse.json({ cards }, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/studysets/[slug]/next:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
