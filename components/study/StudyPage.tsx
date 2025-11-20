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
  onUpdateFlashcard: (flashcardId: number, updates: Partial<Flashcard>) => void;
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

export default function StudyPage({
  trees,
  userId,
  onNavigate,
  onUpdateFlashcard,
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

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

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
        }
      } catch (e) {
        console.error("Failed to load flashcards", e);
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

  // Filter flashcards based on selected trees
  const availableFlashcards = flashcards.filter((fc) =>
    selectedTreeIds.includes(fc.treeId)
  );

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
    if (availableFlashcards.length === 0) {
      return;
    }

    setStudyMode("studying");
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setReviewedCount(0);
    setRating(null);
    setSessionStats({ hard: 0, good: 0, easy: 0 });
  };

  const handleRecall = (difficulty: "hard" | "good" | "easy") => {
    const currentCard = availableFlashcards[currentCardIndex];

    if (!currentCard) {
      return;
    }

    // Calculate new interval and ease factor using SM-2-like logic
    let newInterval = currentCard.interval;
    let newEaseFactor = currentCard.easeFactor;

    if (difficulty === "hard") {
      newInterval = Math.max(1, Math.floor(currentCard.interval * 0.8));
      newEaseFactor = Math.max(1.3, currentCard.easeFactor - 0.15);
    } else if (difficulty === "good") {
      newInterval = Math.floor(currentCard.interval * newEaseFactor);
      newEaseFactor = currentCard.easeFactor;
    } else {
      newInterval = Math.floor(
        currentCard.interval * newEaseFactor * 1.3
      );
      newEaseFactor = currentCard.easeFactor + 0.1;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    onUpdateFlashcard(currentCard.id, {
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview,
    });

    setSessionStats((prev) => ({
      ...prev,
      [difficulty]: prev[difficulty] + 1,
    }));

    setReviewedCount((prev) => prev + 1);
    setShowAnswer(false);
    setCurrentCardIndex((prev) => prev + 1);
  };

  const handleRatingSubmit = (selectedRating: number) => {
    const currentCard = availableFlashcards[currentCardIndex];

    if (!currentCard) {
      return;
    }

    // Map 1–5 rating to difficulty
    // 1–2: hard, 3: good, 4–5: easy
    let difficulty: "hard" | "good" | "easy";

    if (selectedRating <= 2) {
      difficulty = "hard";
    } else if (selectedRating === 3) {
      difficulty = "good";
    } else {
      difficulty = "easy";
    }

    handleRecall(difficulty);
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
