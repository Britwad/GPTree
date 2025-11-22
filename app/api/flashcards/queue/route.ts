import { NextResponse } from 'next/server';
import { PrismaClient, Flashcard } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const limit = Number(url.searchParams.get('limit') || 50);
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const now = new Date();
    const dueNow = await prisma.flashcard.findMany({
        where: { userId, suspended: false, dueAt: {lte: now} },
        orderBy: { dueAt: 'asc' },
        take: limit,
    });

    let newItems: Flashcard[] = [];
    if (dueNow.length < limit) {
        newItems = await prisma.flashcard.findMany({
            where: { userId, suspended: false, repetition: 0 },
            take: limit - dueNow.length,
        });
    }

    return NextResponse.json({ dueNow, newItems });
}