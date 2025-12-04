// app/api/studysets/[slug]/next/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Flashcard } from "@prisma/client";


/* Zod schema for incoming POST body (matches the minimal contract) */
const NextBodySchema = z.object({
  userId: z.string().min(1),
  count: z.number().int().positive().optional(),
});
type NextBody = z.infer<typeof NextBodySchema>;

/* typed params shape */
type Params = { params: Promise<{ slug: string }> };

/* typed payload returned to client */
type CardPayload = {
  id: number;
  name: string;
  content: string;
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string; // ISO
  lastReviewedAt: string | null;
};

/* DB row shape we select from Prisma */
type RawCardDb = Pick<
  Flashcard,
  | "id"
  | "name"
  | "content"
  | "repetition"
  | "intervalDays"
  | "easeFactor"
  | "dueAt"
  | "lastReviewedAt"
>;

/* selection logic: due -> new -> others */
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

/* POST: return next cards for a studyset slug */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    // Read and parse the request (use .parse to match your tree route style)
    const body = await request.json();
    const parsed = NextBodySchema.parse(body) as NextBody;

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
    if (!set) return NextResponse.json({ error: "StudySet not found" }, { status: 404 });

    // Fetch candidate flashcards for that set and user
    const rawCards = (await prisma.flashcard.findMany({
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
    })) as RawCardDb[];

    // Map DB rows to safe payload (ISO dates)
    const cards: CardPayload[] = rawCards.map((c) => ({
      id: c.id,
      name: c.name,
      content: c.content,
      repetition: c.repetition ?? 0,
      intervalDays: c.intervalDays ?? 0,
      easeFactor: c.easeFactor ?? 2.5,
      dueAt: c.dueAt instanceof Date ? c.dueAt.toISOString() : new Date(String(c.dueAt)).toISOString(),
      lastReviewedAt: c.lastReviewedAt
        ? c.lastReviewedAt instanceof Date
          ? c.lastReviewedAt.toISOString()
          : new Date(String(c.lastReviewedAt)).toISOString()
        : null,
    }));

    const next = pickNext(cards, count);

    return NextResponse.json({ cards: next }, { status: 200 });
  } catch (err) {
    console.error("Error in POST /api/studysets/[slug]/next:", err);

    if (err instanceof z.ZodError) {
      // match your tree route pattern: z.flattenError(err)
      return NextResponse.json({ errors: z.flattenError(err) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* GET: convenience/debug endpoint */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const set = await prisma.studySet.findUnique({ where: { slug } });
    if (!set) return NextResponse.json({ error: "StudySet not found" }, { status: 404 });

    const rawCards = (await prisma.flashcard.findMany({
      where: { studySetId: set.id, userId },
      orderBy: { dueAt: "asc" },
      take: 20,
      select: {
        id: true,
        name: true,
        content: true,
        dueAt: true,
      },
    })) as Pick<Flashcard, "id" | "name" | "content" | "dueAt">[];

    const cards = rawCards.map((c) => ({
      id: c.id,
      name: c.name,
      content: c.content,
      dueAt: c.dueAt instanceof Date ? c.dueAt.toISOString() : new Date(String(c.dueAt)).toISOString(),
    }));

    return NextResponse.json({ cards }, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/studysets/[slug]/next:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: z.flattenError(err) }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
