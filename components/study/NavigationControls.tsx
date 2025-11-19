"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

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
      <div className="flex gap-1.5">
        {Array.from({ length: Math.min(10, totalCards) }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: index === currentIndex ? colors.green : colors.lightGray
            }}
          />
        ))}
        {totalCards > 10 && (
          <span className="text-xs ml-2" style={{ color: colors.darkGray }}>
            +{totalCards - 10}
          </span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentIndex >= totalCards - 1}
        className="gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

