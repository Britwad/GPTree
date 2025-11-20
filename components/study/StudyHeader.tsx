"use client";

import { ArrowLeft } from "lucide-react";
import { Button, Progress } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

interface StudyHeaderProps {
  treeName?: string;
  currentCardIndex: number;
  totalCards: number;
  sessionStats: { hard: number; good: number; easy: number };
  onExit: () => void;
}

export default function StudyHeader({
  treeName,
  currentCardIndex,
  totalCards,
  sessionStats,
  onExit,
}: StudyHeaderProps) {
  const progressPercent = ((currentCardIndex + 1) / totalCards) * 100;

  return (
    <header className="sticky top-0 z-10" style={{ backgroundColor: colors.white, borderBottomColor: colors.borderGreen, borderBottomWidth: '2px' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Study
          </Button>
          <div className="flex items-center gap-2">
            <div>
              <p className="font-medium" style={{ color: colors.darkGray }}>{treeName || "Study Session"}</p>
              <p className="text-xs" style={{ color: colors.darkGray }}>
                Card {currentCardIndex + 1} of {totalCards}
              </p>
            </div>
          </div>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>
    </header>
  );
}

