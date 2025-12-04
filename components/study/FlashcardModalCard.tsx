"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { colors } from "@/lib/colors";

interface FlashcardModalCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashcardModalCard({ front, back, isFlipped, onFlip }: FlashcardModalCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="mb-6">
      <div 
        className="flashcard-container relative h-[400px] cursor-pointer"
        onClick={onFlip}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front of card - Question */}
          <div className="flashcard-front rounded-xl shadow-lg relative" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
            <button
              onClick={handleStarClick}
              className="absolute top-4 right-4 z-10 p-2 hover:opacity-80 transition-opacity"
              aria-label="Favorite"
            >
              <Star
                className="w-6 h-6"
                fill={isFavorited ? "#FCD34D" : "none"}
                stroke={isFavorited ? "#FCD34D" : colors.darkGray}
                style={{ color: isFavorited ? "#FCD34D" : colors.darkGray }}
              />
            </button>
            <div className="h-full flex items-center justify-center p-8">
              <p className="text-2xl text-center leading-relaxed" style={{ color: colors.darkGray }}>
                {front}
              </p>
            </div>
          </div>

          {/* Back of card - Answer */}
          <div className="flashcard-back rounded-xl shadow-lg relative" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
            <button
              onClick={handleStarClick}
              className="absolute top-4 right-4 z-10 p-2 hover:opacity-80 transition-opacity"
              aria-label="Favorite"
            >
              <Star
                className="w-6 h-6"
                fill={isFavorited ? "#FCD34D" : "none"}
                stroke={isFavorited ? "#FCD34D" : colors.darkGray}
                style={{ color: isFavorited ? "#FCD34D" : colors.darkGray }}
              />
            </button>
            <div className="h-full flex items-center justify-center p-8">
              <p className="text-2xl text-center leading-relaxed" style={{ color: colors.darkGray }}>
                {back}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

