import { useState, useEffect } from "react";
import * as React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Flashcard } from "@/lib/App";
import { colors } from "@/lib/colors";

// Utility function for className merging
function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-green-600 text-white hover:bg-green-700",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "ghost" && "hover:bg-gray-100 text-gray-700",
          variant === "link" && "text-green-600 underline-offset-4 hover:underline",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

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

        {/* Quizlet-style Flashcard */}
        <div className="mb-6">
          <div 
            className="flashcard-container relative h-[400px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
              {/* Front of card - Question */}
              <div className="flashcard-front rounded-xl shadow-lg" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
                <div className="h-full flex items-center justify-center p-8">
                  <p className="text-2xl text-center leading-relaxed" style={{ color: colors.darkGray }}>
                    {currentCard.front}
                  </p>
                </div>
              </div>

              {/* Back of card - Answer */}
              <div className="flashcard-back rounded-xl shadow-lg" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
                <div className="h-full flex items-center justify-center p-8">
                  <p className="text-2xl text-center leading-relaxed" style={{ color: colors.darkGray }}>
                    {currentCard.back}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with flip instruction */}
          <div 
            className="mt-4 py-4 px-6 rounded-lg text-center"
            style={{ backgroundColor: colors.green }}
          >
            <p className="text-white text-sm flex items-center justify-center gap-2">
              Click the card to flip
              <span className="text-lg">👆</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={flashcards.length <= 1}
            style={{ borderColor: colors.lightGray, color: colors.darkGray }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {flashcards.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: index === currentIndex ? colors.green : colors.lightGray
                }}
              />
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={flashcards.length <= 1}
            style={{ borderColor: colors.lightGray, color: colors.darkGray }}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Info */}
        <p className="text-center text-sm mt-4" style={{ color: colors.darkGray }}>
          Use ← → arrow keys to navigate, ↑ ↓ to flip
        </p>
      </div>
    </div>
  );
}