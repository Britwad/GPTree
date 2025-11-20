"use client";

import { Button } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

interface RatingPanelProps {
  rating: number | null;
  onRatingSubmit: (rating: number) => void;
}

export default function RatingPanel({ rating, onRatingSubmit }: RatingPanelProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <div className="p-6 rounded-xl sticky top-24" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
        <p className="text-lg font-semibold mb-4 text-center" style={{ color: colors.darkGray }}>
          Rate Difficulty
        </p>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              onClick={() => onRatingSubmit(num)}
              variant={rating === num ? "default" : "outline"}
              size="lg"
              className="w-full justify-start"
              style={{
                ...(rating === num ? {} : { borderColor: colors.lightGray, color: colors.darkGray }),
              }}
            >
              <span className="text-xl font-bold mr-3">{num}</span>
              <span className="text-sm">
                {num === 1 && "Very Hard"}
                {num === 2 && "Hard"}
                {num === 3 && "Good"}
                {num === 4 && "Easy"}
                {num === 5 && "Very Easy"}
              </span>
            </Button>
          ))}
        </div>
        <p className="text-xs text-center mt-4" style={{ color: colors.darkGray }}>
          Click a rating to continue
        </p>
      </div>
    </div>
  );
}

