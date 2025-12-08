"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./StudyUIComponents";

interface NavigationControlsProps {
  currentIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function NavigationControls({
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
}: NavigationControlsProps) {
  const isLastCard = currentIndex === totalCards - 1;

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        className="gap-2"
      >
        {isLastCard ? (
          "Finish"
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
