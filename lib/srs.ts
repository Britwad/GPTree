// Spaced Repetition Helper
export function clampEF(ef: number) {
    return Math.max(1.3, ef);
}

export function reviewCardSM2(current: {
    repetition: number;
    intervalDays: number;
    easeFactor: number;
    lapses?: number;
}, quality: number, reviewDate: Date = new Date()) {
    let { repetition, intervalDays, easeFactor, lapses } = current;
    lapses = lapses ?? 0;

    if (quality < 3) {
        repetition = 0;
        intervalDays = 1;
        lapses = lapses + 1;
    } else {
        repetition = (repetition || 0) + 1;
        if (repetition === 1) {
            intervalDays = 1;
        } else if (repetition === 2) {
            intervalDays = 6;
        } else {
            intervalDays = Math.round((intervalDays || 6) * easeFactor);
        }

        const q = quality;
        const newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        easeFactor = clampEF(newEF);
    }

    const nextDue = new Date(reviewDate);
    nextDue.setDate(nextDue.getDate() + intervalDays);

    return { repetition, intervalDays, easeFactor, lapses, dueAt: nextDue, lastReviewedAt: reviewDate };
}