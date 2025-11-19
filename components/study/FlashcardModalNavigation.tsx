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
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={totalCards <= 1}
        style={{ borderColor: colors.lightGray, color: colors.darkGray }}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>

      <div className="flex gap-2">
        {Array.from({ length: totalCards }).map((_, index) => (
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
        onClick={onNext}
        disabled={totalCards <= 1}
        style={{ borderColor: colors.lightGray, color: colors.darkGray }}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

