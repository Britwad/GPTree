"use client";

import { colors } from "@/lib/colors";

interface FlashcardCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashcardCard({ front, back, isFlipped, onFlip }: FlashcardCardProps) {
  return (
    <div className="mb-8">
      <div 
        className="flashcard-container relative h-[500px] cursor-pointer"
        onClick={onFlip}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front of card - Question */}
          <div className="flashcard-front rounded-xl shadow-lg" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
            <div className="h-full flex items-center justify-center p-8">
              <p className="text-2xl text-center leading-relaxed" style={{ color: colors.darkGray }}>
                {front}
              </p>
            </div>
          </div>

          {/* Back of card - Answer */}
          <div className="flashcard-back rounded-xl shadow-lg" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
            <div className="h-full flex items-center justify-center p-8">
              <p className="text-2xl text-center leading-relaxed" style={{ color: colors.darkGray }}>
                {back}
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
  );
}

