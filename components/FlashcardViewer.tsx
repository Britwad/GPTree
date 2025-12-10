"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { colors } from "@/lib/colors";
import { Button } from "./study/StudyUIComponents";
import FlashcardModalCard from "./study/FlashcardModalCard";
import NavigationControls from "./study/NavigationControls";
import RatingPanel from "./study/RatingPanel";

export type Flashcard = {
  front: string;
  back: string;
  rating?: number;
};

type FlashcardViewerProps = {
  flashcards: Flashcard[];
  onExit: () => void;
};

export default function FlashcardViewer({ flashcards, onExit }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<(number | null)[]>(flashcards.map(() => null));
  const [completed, setCompleted] = useState(false);

  const currentCard = flashcards[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    if (flashcards.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      } else if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flashcards.length]);

  if (flashcards.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <p style={{ color: colors.darkGray }}>No flashcards available.</p>
            <Button onClick={onExit} className="mt-4">Close</Button>
          </div>
        </div>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex + 1 >= flashcards.length){
        setCompleted(true);
    } else{
        setCurrentIndex((prev) => (prev + 1));
    }
    
  }
  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  }
  const handleRating = (rating: number) => {
    const newRatings = [...ratings];
    newRatings[currentIndex] = rating;
    setRatings(newRatings);
  };

  if (completed) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.darkGray }}>
          🎉 You finished all flashcards!
        </h2>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setCompleted(false);
              setRatings(flashcards.map(() => null));
            }}
          >
            Restart
          </Button>
          <Button onClick={onExit} variant="outline">Exit</Button>
        </div>
      </div>
  );
}


  return (
    <div className="w-full max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p style={{ color: colors.darkGray }}>
            Card {currentIndex + 1} of {flashcards.length}
          </p>
          <Button variant="ghost" size="sm" onClick={onExit}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main content: Flashcard left, Ratings right */}
        <div className="flex gap-6">
          {/* Flashcard */}
          <div className="flex-1 max-w-xl flex items-center justify-center">
            <div className="w-full p-4 rounded-lg overflow-auto break-words">
              <FlashcardModalCard
                front={currentCard.front}
                back={currentCard.back}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
              />
            </div>
          </div>

          {/* Ratings + Navigation */}
          <div className="w-64 flex flex-col items-center justify-start">
            <RatingPanel
              rating={ratings[currentIndex]}
              onRatingSubmit={handleRating}
            />
            <div className="mt-4 w-full">
              <NavigationControls
                currentIndex={currentIndex}
                totalCards={flashcards.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            </div>
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-sm mt-4" style={{ color: colors.darkGray }}>
          Use ← → arrow keys to navigate, ↑ ↓ to flip
        </p>
      </div>
  );
}
