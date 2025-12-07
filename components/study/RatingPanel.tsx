"use client";

import { Button } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

interface RatingPanelProps {
  rating: number | null; // currently selected rating
  onRatingSubmit: (rating: number) => void;
}

export default function RatingPanel({ rating, onRatingSubmit }: RatingPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((num) => {
        const isSelected = rating === num;

        return (
          <Button
            key={num}
            onClick={() => onRatingSubmit(num)}
            variant={isSelected ? "default" : "outline"}
            className="w-full justify-start"
            style={{
              backgroundColor: isSelected ? colors.darkGreen : undefined,
              color: isSelected ? colors.white : colors.darkGray,
              borderColor: isSelected ? colors.darkGreen : colors.lightGray,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = colors.superLightGreen;
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
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
        );
      })}
    </div>
  );
}