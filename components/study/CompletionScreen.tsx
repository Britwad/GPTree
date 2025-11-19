"use client";

import { Button, Card, Progress } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

interface CompletionScreenProps {
  reviewedCount: number;
  sessionStats: { hard: number; good: number; easy: number };
  onBackToSelection: () => void;
}

export default function CompletionScreen({
  reviewedCount,
  sessionStats,
  onBackToSelection,
}: CompletionScreenProps) {
  const totalReviewed = sessionStats.hard + sessionStats.good + sessionStats.easy;
  const accuracyScore =
    totalReviewed > 0
      ? Math.round(
          ((sessionStats.good + sessionStats.easy) / totalReviewed) * 100
        )
      : 0;

  return (
    <div className="flex items-center justify-center p-4" style={{ backgroundColor: colors.superLightGreen, minHeight: '100vh' }}>
      <Card className="p-12 text-center max-w-lg w-full">
        <h2 className="text-3xl mb-2" style={{ color: colors.darkGray }}>Session Complete!</h2>
        <p className="mb-8" style={{ color: colors.darkGray }}>
          You've reviewed {reviewedCount} cards. Great work!
        </p>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg" style={{ borderColor: colors.lightGray, borderWidth: '1px' }}>
            <div className="text-2xl mb-1" style={{ color: colors.darkGray }}>{sessionStats.hard}</div>
            <div className="text-sm" style={{ color: colors.darkGray }}>Hard</div>
          </div>
          <div className="p-4 rounded-lg" style={{ borderColor: colors.lightGray, borderWidth: '1px' }}>
            <div className="text-2xl mb-1" style={{ color: colors.darkGray }}>{sessionStats.good}</div>
            <div className="text-sm" style={{ color: colors.darkGray }}>Good</div>
          </div>
          <div className="p-4 rounded-lg" style={{ borderColor: colors.lightGray, borderWidth: '1px' }}>
            <div className="text-2xl mb-1" style={{ color: colors.darkGray }}>{sessionStats.easy}</div>
            <div className="text-sm" style={{ color: colors.darkGray }}>Easy</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: colors.darkGray }}>Retention Score</span>
            <span className="font-medium" style={{ color: colors.darkGray }}>{accuracyScore}%</span>
          </div>
          <Progress value={accuracyScore} className="h-2" />
        </div>

        <Button size="lg" onClick={onBackToSelection} className="w-full">
          Back to Study Selection
        </Button>
      </Card>
    </div>
  );
}

