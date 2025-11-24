"use client";

import { useEffect } from "react";
import StudyHeader from "./StudyHeader";
import FlashcardCard from "./FlashcardCard";
import RatingPanel from "./RatingPanel";
import NavigationControls from "./NavigationControls";
import { colors } from "@/lib/colors";
import type { Flashcard, Tree } from "@/lib/App";

interface StudySessionViewProps {
  currentCard: Flashcard;
  currentCardIndex: number;
  totalCards: number;
  currentTree?: Tree;
  showAnswer: boolean;
  rating: number | null;
  sessionStats: { hard: number; good: number; easy: number };
  onFlip: () => void;
  onRatingSubmit: (rating: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onExit: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

export default function StudySessionView({
  currentCard,
  currentCardIndex,
  totalCards,
  currentTree,
  showAnswer,
  rating,
  sessionStats,
  onFlip,
  onRatingSubmit,
  onPrevious,
  onNext,
  onExit,
  onKeyDown,
}: StudySessionViewProps) {
  useEffect(() => {
    if (!onKeyDown) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }
      onKeyDown(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div style={{ backgroundColor: colors.superLightGreen, minHeight: '100vh' }}>
      <StudyHeader
        treeName={currentTree?.name}
        currentCardIndex={currentCardIndex}
        totalCards={totalCards}
        sessionStats={sessionStats}
        onExit={onExit}
      />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex gap-6 items-start">
          <div className="flex-1">
            <FlashcardCard
              front={currentCard.front}
              back={currentCard.back}
              isFlipped={showAnswer}
              onFlip={onFlip}
            />
            <NavigationControls
              currentIndex={currentCardIndex}
              totalCards={totalCards}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>

          <div className="w-80 flex-shrink-0">
            {showAnswer ? (
              <RatingPanel
                rating={rating}
                onRatingSubmit={onRatingSubmit}
              />
            ) : (
              <div className="h-[500px]" />
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm" style={{ color: colors.darkGray }}>
          <p>
            Use ← → arrow keys to navigate, ↑ ↓ to flip. Rate honestly to optimize your learning.
          </p>
        </div>
      </main>
    </div>
  );
}

