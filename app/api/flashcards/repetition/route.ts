// API route for spaced repetition
import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { reviewCardSM2 } from "@/lib/srs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.json();
    const { cardId, quality, reviewTime } = body;

    if (typeof cardId !== 'number') {
        return NextResponse.json({ error: 'cardId (number) required' }, {status: 400});
    }
    if (typeof quality !== 'number' || quality < 0 || quality > 5) {
        return NextResponse.json({ error: 'quality must be an integer between 0 and 5'}, {status: 400});
    }

    const reviewDate = reviewTime ? new Date(reviewTime) : new Date();

    const card = await prisma.flashcard.findUnique({ where: { id: cardId } });
    if (!card) {
        return NextResponse.json({ error: 'card not found' }, {status: 404});
    }

    const update = reviewCardSM2({
        repetition: card.repetition,
        intervalDays: card.intervalDays,
        easeFactor: card.easeFactor,
        lapses: card.lapses ?? 0,
    }, quality, reviewDate);

    const updated = await prisma.flashcard.update({
        where: { id: cardId },
        data: {
            repetition: update.repetition,
            intervalDays: update.intervalDays,
            easeFactor: update.easeFactor,
            lapses: update.lapses,
            dueAt: update.dueAt,
            lastReviewedAt: update.lastReviewedAt,
            learningStepIndex: null,
        },
    });

    return NextResponse.json({
        id: updated.id,
        repetition: updated.repetition,
        intervalDays: updated.intervalDays,
        easeFactor: updated.easeFactor,
        dueAt: updated.dueAt,
        lastReviewedAt: updated.lastReviewedAt,
        lapses: updated.lapses,
    });
}