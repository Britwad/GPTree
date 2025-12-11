"use client";

import { useEffect, useRef, useState } from "react";
import type { Flashcard as PrismaFlashcard } from "@prisma/client";
import FlashcardViewer, {Flashcard} from "@/components/FlashcardViewer";
import { useRouter } from "next/navigation";

type QueueResponse = { cards: PrismaFlashcard[] };

// UI card derived from PrismaFlashcard (keeps fields explicit)
interface UiCard {
  id: number;
  front: string;
  back: string;
  due: string | null;
  interval: number | null;
  ease: number | null;
  lapses: number | null;
  nodeId: number | null;
  studySetId: number | null;
}

export default function SpacedRep({ userId }: { userId: string }) {
  const [cards, setCards] = useState<UiCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const lastFetchId = useRef(0);
  const mountedRef = useRef(true);

  const router = useRouter();

  const handleExit = () => {
    router.push("/tree");
  };


  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchId = ++lastFetchId.current;

    async function loadQueue() {
      setLoading(true);
      setError(null);
      console.debug(`[FlashcardQueue] fetch#${fetchId} start (user=${userId})`);
      try {
        const url = `/api/flashcards/queue?userId=${encodeURIComponent(userId)}&limit=50`;
        const res = await fetch(url, { method: "GET", signal });

        if (!res.ok) {
          const body = await res.json().catch(() => ({} as Record<string, unknown>));
          throw new Error(typeof body.error === "string" ? body.error : `Server returned ${res.status}`);
        }

        const payload = (await res.json()) as QueueResponse;
        const serverCards = payload.cards ?? [];

        const seen = new Set<number>();
        const deduped: PrismaFlashcard[] = [];
        for (const c of serverCards) {
          if (seen.has(c.id)) continue;
          seen.add(c.id);
          deduped.push(c);
        }

        const mapped: UiCard[] = deduped.map((c) => ({
          id: c.id,
          front: c.name ?? "Untitled",
          back: c.content ?? "",
          due: c.dueAt ? String(c.dueAt) : null,
          interval: typeof c.intervalDays === "number" ? c.intervalDays : null,
          ease: typeof c.easeFactor === "number" ? c.easeFactor : null,
          lapses: typeof c.lapses === "number" ? c.lapses : null,
          nodeId: typeof c.nodeId === "number" ? c.nodeId : null,
          studySetId: typeof c.studySetId === "number" ? c.studySetId : null,
        }));

        console.debug(`[FlashcardQueue] fetch#${fetchId} got ${mapped.length} cards`);

        if (fetchId === lastFetchId.current && mountedRef.current) {
          if (mapped.length > 0) {
            setCards(mapped);
          } else {
            console.debug(`[FlashcardQueue] fetch#${fetchId} returned empty — keeping previous cards`);
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          console.debug(`[FlashcardQueue] fetch#${fetchId} aborted`);
          return;
        }
        console.error(`[FlashcardQueue] fetch#${fetchId} error:`, err);
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (fetchId === lastFetchId.current && mountedRef.current) {
          setLoading(false);
        }
        console.debug(`[FlashcardQueue] fetch#${fetchId} done`);
      }
    }

    loadQueue();

    return () => {
      controller.abort();
    };
  }, [userId]);

  // Map UiCards to FlashcardViewer format
  const flashcardsForViewer: Flashcard[] = cards.map(c => ({
    front: c.front,
    back: c.back
  }));

  if (loading && cards.length === 0) return <div>Loading flashcard queue...</div>;
  if (error && cards.length === 0) return <div className="text-red-600">Error: {error}</div>;
  if (!loading && cards.length === 0) return <div>No flashcards due right now 🎉</div>;

  return (
  <div className="w-full flex justify-center px-4">
    <div className="max-w-4xl w-full">
      {loading && cards.length > 0 && (
        <div className="text-sm text-gray-500 mb-2">
          Refreshing… (showing cached results)
        </div>
      )}

      <FlashcardViewer
        flashcards={flashcardsForViewer}
        onExit={handleExit}
      />
    </div>
  </div>
);


}
