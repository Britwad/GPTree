// app/api/studysets/[slug]/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * Zod schema for the POST body
 * - userId: string
 * - cardId: number
 * - quality: number (0..5)
 */
const ReviewBodySchema = z.object({
  userId: z.string().min(1),
  cardId: z.number().int().positive(),
  quality: z.number().min(0).max(5),
});

type ReviewBody = z.infer<typeof ReviewBodySchema>;

/**
 * Card shape we need from the DB (typed, not any)
 * Matches selected fields in prisma.flashcard.findUnique below
 */
type CardFromDb = {
  id: number;
  userId: string;
  studySetId: number | null;
  repetition: number | null;
  intervalDays: number | null;
  easeFactor: number | null;
  dueAt: Date;
  lastReviewedAt: Date | null;
  lapses: number | null;
};

/** SM-2-ish update; typed to accept CardFromDb and return typed updates */
function updateAfterReview(card: CardFromDb, quality: number) {
  let repetition = card.repetition ?? 0;
  let interval = card.intervalDays ?? 0;
  let ease = card.easeFactor ?? 2.5;
  let lapses = card.lapses ?? 0;

  if (quality < 3) {
    repetition = 0;
    interval = 1;
    lapses = lapses + 1;
  } else {
    repetition = (repetition || 0) + 1;
    if (repetition === 1) interval = 1;
    else if (repetition === 2) interval = 6;
    else interval = Math.round((interval || 1) * (ease || 2.5));
    ease = Math.max(1.3, (ease || 2.5) + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + interval);

  return {
    repetition,
    intervalDays: interval,
    easeFactor: ease,
    dueAt: nextDue,
    lastReviewedAt: new Date(),
    lapses,
  };
}

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    // Parse + validate body safely (no `any`)
    const raw = (await request.json()) as unknown;
    const parsed = ReviewBodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }
    const body: ReviewBody = parsed.data;

    const { userId, cardId, quality } = body;

    // verify studyset exists
    const set = await prisma.studySet.findUnique({ where: { slug } });
    if (!set) return NextResponse.json({ error: "StudySet not found" }, { status: 404 });

    // fetch card with typed selection
    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        userId: true,
        studySetId: true,
        repetition: true,
        intervalDays: true,
        easeFactor: true,
        dueAt: true,
        lastReviewedAt: true,
        lapses: true,
      },
    });

    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

    // Type-assert to CardFromDb for the helper (safe because we selected exact fields)
    const typedCard = card as CardFromDb;

    // ensure card belongs to requested user and set
    if (typedCard.userId !== userId || typedCard.studySetId !== set.id) {
      return NextResponse.json({ error: "Card not found in this studyset for this user" }, { status: 404 });
    }

    // compute new SRS fields
    const updates = updateAfterReview(typedCard, quality);

    // persist updates
    const updated = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        repetition: updates.repetition,
        intervalDays: updates.intervalDays,
        easeFactor: updates.easeFactor,
        dueAt: updates.dueAt,
        lastReviewedAt: updates.lastReviewedAt,
        lapses: updates.lapses,
      },
      select: {
        id: true,
        name: true,
        content: true,
        repetition: true,
        intervalDays: true,
        easeFactor: true,
        dueAt: true,
        lastReviewedAt: true,
        lapses: true,
      },
    });

    // Convert date fields to ISO strings to avoid Date objects leaking to client
    const responseCard = {
      ...updated,
      dueAt: updated.dueAt instanceof Date ? updated.dueAt.toISOString() : new Date(updated.dueAt).toISOString(),
      lastReviewedAt: updated.lastReviewedAt ? (updated.lastReviewedAt instanceof Date ? updated.lastReviewedAt.toISOString() : new Date(updated.lastReviewedAt).toISOString()) : null,
    };

    return NextResponse.json({ card: responseCard }, { status: 200 });
  } catch (err) {
    console.error("Error updating review:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
