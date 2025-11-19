import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Flashcard } from "@/lib/App";
import { colors } from "@/lib/colors";
import { Button } from "./study/StudyUIComponents";
import FlashcardModalCard from "./study/FlashcardModalCard";
import FlashcardModalNavigation from "./study/FlashcardModalNavigation";

type FlashcardViewModalProps = {
  flashcards: Flashcard[];
  treeName: string;
  onClose: () => void;
};

export default function FlashcardViewModal({
  flashcards,
  treeName,
  onClose,
}: FlashcardViewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Flashcards - {treeName}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No flashcards generated yet.</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys if not typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flashcards.length]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8" style={{ backgroundColor: colors.white }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl" style={{ color: colors.darkGray }}>Flashcards - {treeName}</h2>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              Card {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <FlashcardModalCard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />

        <FlashcardModalNavigation
          currentIndex={currentIndex}
          totalCards={flashcards.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {/* Info */}
        <p className="text-center text-sm mt-4" style={{ color: colors.darkGray }}>
          Use ← → arrow keys to navigate, ↑ ↓ to flip
        </p>
      </div>
    </div>
  );
}