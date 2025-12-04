"use client";

import { useState, useEffect } from "react";
import type { Tree, Flashcard, AppState } from "@/lib/App";
import StudySelectionView from "./StudySelectionView";
import StudySessionView from "./StudySessionView";
import CompletionScreen from "./CompletionScreen";

type StudyPageProps = {
  trees: Tree[];
  userId: string;
  onNavigate: (page: AppState["currentPage"]) => void;
  onUpdateFlashcard?: (flashcardId: number, updates: Partial<Flashcard>) => void;
};

// Types for the API response
type ApiFlashcard = {
  id: number;
  name: string;
  content: string;
  interval?: number;
  easeFactor?: number;
  nextReview?: string;
};

type ApiNode = {
  id: number;
  treeId?: number;
  tree?: { id: number };
  flashcards?: ApiFlashcard[];
};

function mapUiToSm2(uiRating: number): number {
  switch (uiRating) {
    case 5: return 5;
    case 4: return 4;
    case 3: return 3;
    case 2: return 2;
    case 1: return 0; // treat "Very Hard" as lapse
    default: return 3;
  }
}

export default function StudyPage({
  trees,
  userId,
  onNavigate,
}: StudyPageProps) {
  const [selectedTreeIds, setSelectedTreeIds] = useState<number[]>(
    trees.map((t) => t.id)
  );
  const [studyMode, setStudyMode] = useState<"select" | "studying">("select");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [rating, setRating] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState({
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyQueue, setStudyQueue] = useState<Flashcard[]>([]);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoadingFlashcards(false);
      return;
    }

    let cancelled = false;
    setIsLoadingFlashcards(true);

    (async () => {
      try {
        const res = await fetch(
          `/api/nodes?userId=${encodeURIComponent(userId)}`
        );

        const json = (await res.json()) as { nodes?: ApiNode[] };
        const nodes: ApiNode[] = json.nodes ?? [];

        const cards: Flashcard[] = nodes.flatMap((n) =>
          (n.flashcards ?? []).map((f) => ({
            id: f.id,
            front: f.name,
            back: f.content,
            nodeId: n.id,
            treeId: n.treeId ?? n.tree?.id ?? 0,
            interval: f.interval ?? 1,
            easeFactor: f.easeFactor ?? 2.5,
            nextReview: f.nextReview ? new Date(f.nextReview) : new Date(),
          }))
        );

        if (!cancelled) {
          setFlashcards(cards);
          setIsLoadingFlashcards(false);
        }
      } catch (e) {
        console.error("Failed to load flashcards", e);
        if (!cancelled) {
          setIsLoadingFlashcards(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, trees]);

  // Calculate tree stats
  const treeStats = trees.map((tree) => ({
    ...tree,
    flashcardCount: flashcards.filter((fc) => fc.treeId === tree.id).length,
  }));

  // Filter flashcards based on selected trees (from nodes)
  const availableFlashcardsFromNodes = flashcards.filter((fc) =>
    selectedTreeIds.includes(fc.treeId)
  );

  // Prefer a prioritized study queue from the server when available
  const availableFlashcards = studyQueue.length > 0 ? studyQueue : availableFlashcardsFromNodes;

  useEffect(() => {
    if (
      studyMode === "studying" &&
      currentCardIndex >= availableFlashcards.length
    ) {
      setStudyMode("select");
      setCurrentCardIndex(0);
    }
  }, [currentCardIndex, availableFlashcards.length, studyMode]);

  const toggleTreeSelection = (treeId: number) => {
    setSelectedTreeIds((prev) =>
      prev.includes(treeId)
        ? prev.filter((id) => id !== treeId)
        : [...prev, treeId]
    );
  };

  const startStudying = () => {
    (async () => {
      // Try to load a prioritized queue from the server first
      try {
        const queued = await loadQueue();
        const candidateCount = queued.length || availableFlashcardsFromNodes.length;
        if (candidateCount === 0) return;
      } catch {
        // If queue fetch fails, fall back to locally available flashcards
        if (availableFlashcardsFromNodes.length === 0) return;
      }

      setStudyMode("studying");
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setReviewedCount(0);
      setRating(null);
      setSessionStats({ hard: 0, good: 0, easy: 0 });
    })();
  };

  async function loadQueue(limit = 50): Promise<Flashcard[]> {
    if (!userId) return [];

    try {
      const res = await fetch(`/api/flashcards/queue?userId=${encodeURIComponent(userId)}&limit=${limit}`);
      if (!res.ok) {
        console.error("Failed to load queue", res.statusText);
        return [];
      }

      const json = await res.json();
      type QueueCard = {
        id: number;
        name?: string;
        content?: string;
        nodeId?: number;
        treeId?: number;
        intervalDays?: number;
        interval?: number;
        easeFactor?: number;
        dueAt?: string;
      };

      const cards = (json.cards ?? []) as QueueCard[];

      const mapped: Flashcard[] = cards.map((c) => ({
        id: c.id,
        front: c.name ?? "",
        back: c.content ?? "",
        nodeId: c.nodeId ?? 0,
        treeId: c.treeId ?? 0,
        interval: c.intervalDays ?? c.interval ?? 1,
        easeFactor: c.easeFactor ?? 2.5,
        nextReview: c.dueAt ? new Date(c.dueAt) : new Date(),
      }));

      setStudyQueue(mapped);
      return mapped;
    } catch (err) {
      console.error("Error fetching study queue", err);
      return [];
    }
  }

  

  const handleRatingSubmit = async (selectedRating: number) => {
    const currentCard = availableFlashcards[currentCardIndex];

    if (!currentCard) {
      return;
    }

    const quality = mapUiToSm2(selectedRating);
    setRating(selectedRating);
    setReviewedCount((p) => p + 1);
    setSessionStats((prev) => {
      if (selectedRating <= 2) return { ...prev, hard: prev.hard + 1 };
      if (selectedRating === 3) return { ...prev, good: prev.good + 1};
      return { ...prev, easy: prev.easy + 1};
    })

    try {
      const res = await fetch('/api/flashcards/repetition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          quality,
          reviewTime: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        let serverMessage = "Unknown error";

        try {
          if (contentType.includes("application/json")) {
            const data: unknown = await res.json();

            if (
              typeof data === "object" &&
              data !== null &&
              "error" in data &&
              typeof (data as Record<string, unknown>).error === "string"
            ) {
              serverMessage = (data as Record<string, string>).error;
            } else {
              serverMessage = JSON.stringify(data);
            }
          } else {
            serverMessage = await res.text();
          }
        } catch {
          serverMessage = "Failed to parse server error";
        }

        console.error("Review API Error", {
          status: res.status,
          body: serverMessage,
        });

        throw new Error(`Server returned ${res.status}: ${serverMessage}`);
      }


      type ReviewResponse = {
        id: number;
        intervalDays: number;
        easeFactor: number;
        dueAt: string;
      };

      const updated: ReviewResponse = await res.json();

      setFlashcards((prev) =>
        prev.map((fc) =>
          fc.id === updated.id
            ? {
                ...fc,
                interval: updated.intervalDays,
                easeFactor: updated.easeFactor,
                nextReview: new Date(updated.dueAt),
            }
          : fc
        )
      );
    } catch (e) {
      console.error("Review API failed", e);
    }

    setShowAnswer(false);
    setCurrentCardIndex((prev) => prev + 1);
    setRating(null);
  };

  const handleNextCard = () => {
    if (currentCardIndex < availableFlashcards.length - 1) {
      setShowAnswer(false);
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setShowAnswer(false);
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();

      if (currentCardIndex > 0) {
        setShowAnswer(false);
        setCurrentCardIndex((prev) => prev - 1);
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();

      if (currentCardIndex < availableFlashcards.length - 1) {
        setShowAnswer(false);
        setCurrentCardIndex((prev) => prev + 1);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setShowAnswer((prev) => !prev);
    }
  };

  // Selection Mode
  if (studyMode === "select") {
    return (
      <StudySelectionView
        trees={treeStats}
        selectedTreeIds={selectedTreeIds}
        availableFlashcardsCount={availableFlashcards.length}
        isLoadingFlashcards={isLoadingFlashcards}
        onToggleTree={toggleTreeSelection}
        onStartStudying={startStudying}
        onNavigate={(p) => {
          if (p === "dashboard") {
            onNavigate("dashboard");
          } else if (p === "landing" || p === "study") {
            onNavigate("landing");
          } else {
            onNavigate("study");
          }
        }}
      />
    );
  }

  // Completion Screen
  if (
    availableFlashcards.length === 0 ||
    currentCardIndex >= availableFlashcards.length
  ) {
    return (
      <CompletionScreen
        reviewedCount={reviewedCount}
        sessionStats={sessionStats}
        onBackToSelection={() => setStudyMode("select")}
      />
    );
  }

  // Studying Mode
  const currentCard = availableFlashcards[currentCardIndex];
  const currentTree = trees.find((t) => t.id === currentCard.treeId);

  return (
    <StudySessionView
      currentCard={currentCard}
      currentCardIndex={currentCardIndex}
      totalCards={availableFlashcards.length}
      currentTree={currentTree}
      showAnswer={showAnswer}
      rating={rating}
      sessionStats={sessionStats}
      onFlip={() => setShowAnswer(!showAnswer)}
      onRatingSubmit={handleRatingSubmit}
      onPrevious={handlePreviousCard}
      onNext={handleNextCard}
      onExit={() => setStudyMode("select")}
      onKeyDown={handleKeyDown}
    />
  );
}
