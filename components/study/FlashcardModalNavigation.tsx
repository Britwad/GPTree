"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

interface FlashcardModalNavigationProps {
  currentIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function FlashcardModalNavigation({
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
}: FlashcardModalNavigationProps) {
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === totalCards - 1;

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={totalCards <= 1 || isFirstCard}
        style={{ borderColor: colors.lightGray, color: colors.darkGray }}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={totalCards <= 1 || isLastCard}
        style={{ borderColor: colors.lightGray, color: colors.darkGray }}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
