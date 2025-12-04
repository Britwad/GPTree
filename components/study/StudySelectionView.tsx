"use client";

import { ArrowLeft } from "lucide-react";
import { Button, Card, Checkbox } from "./StudyUIComponents";
import { colors } from "@/lib/colors";
import type { Tree } from "@/lib/App";

interface StudySelectionViewProps {
  trees: Array<Tree & { flashcardCount: number }>;
  selectedTreeIds: number[];
  availableFlashcardsCount: number;
  isLoadingFlashcards?: boolean;
  onToggleTree: (treeId: number) => void;
  onStartStudying: () => void;
  onNavigate: (page: string) => void;
}

export default function StudySelectionView({
  trees,
  selectedTreeIds,
  availableFlashcardsCount,
  isLoadingFlashcards = false,
  onToggleTree,
  onStartStudying,
  onNavigate,
}: StudySelectionViewProps) {
  const totalCards = trees.reduce((sum, tree) => sum + tree.flashcardCount, 0);

  return (
    <div style={{ backgroundColor: colors.superLightGreen, minHeight: '100vh' }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: colors.white, borderBottomColor: colors.borderGreen, borderBottomWidth: '2px' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl" style={{ color: colors.darkGray }}>Spaced Repetition Study</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl mb-4" style={{ color: colors.darkGray }}>Review Your Flashcards</h2>
          <p className="text-lg" style={{ color: colors.darkGray }}>
            Select which topics you want to study using proven spaced repetition techniques.
          </p>
        </div>

        {/* Stats Overview - Only show when not loading */}
        {!isLoadingFlashcards && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-sm" style={{ color: colors.darkGray }}>Total Cards</p>
                  <p className="text-2xl" style={{ color: colors.darkGray }}>{totalCards}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-sm" style={{ color: colors.darkGray }}>Trees</p>
                  <p className="text-2xl" style={{ color: colors.darkGray }}>{trees.length}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tree Selection */}
        {isLoadingFlashcards ? (
          <Card className="p-6 mb-6">
            <h3 className="text-xl mb-4" style={{ color: colors.darkGray }}>Select Topics to Study</h3>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              Loading flashcards...
            </p>
          </Card>
        ) : trees.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-xl mb-2" style={{ color: colors.darkGray }}>No Trees Yet</h3>
            <p className="mb-6" style={{ color: colors.darkGray }}>
              Create your first learning tree to start generating flashcards.
            </p>
            <Button onClick={() => onNavigate("dashboard")}>
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <Card className="p-6 mb-6">
            <h3 className="text-xl mb-4" style={{ color: colors.darkGray }}>Select Topics to Study</h3>
            <div className="space-y-3">
              {trees.map((tree) => (
                <div
                  key={tree.id}
                  className="flex items-center justify-between p-4 rounded-lg transition-colors"
                  style={{ borderColor: colors.lightGray, borderWidth: '1px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.superLightGreen}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`tree-${tree.id}`}
                      checked={selectedTreeIds.includes(tree.id)}
                      onCheckedChange={() => onToggleTree(tree.id)}
                    />
                    <label
                      htmlFor={`tree-${tree.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <p className="font-medium" style={{ color: colors.darkGray }}>{tree.name}</p>
                      <p className="text-sm" style={{ color: colors.darkGray }}>
                        {tree.flashcardCount} cards total
                      </p>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Start Button - Only show when not loading and there are trees */}
        {!isLoadingFlashcards && trees.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl mb-1" style={{ color: colors.darkGray }}>
                  {availableFlashcardsCount} cards available
                </p>
                <p className="text-sm" style={{ color: colors.darkGray }}>
                  From {selectedTreeIds.length} selected{" "}
                  {selectedTreeIds.length === 1 ? "topic" : "topics"}
                </p>
              </div>
              <Button
                size="lg"
                onClick={onStartStudying}
                disabled={availableFlashcardsCount === 0}
              >
                Start Studying
              </Button>
            </div>
          </Card>
        )}

        {/* Help Text - Only show when not loading and there are trees */}
        {!isLoadingFlashcards && trees.length > 0 && (
          <div className="mt-8 p-4 rounded-lg" style={{ borderColor: colors.lightGray, borderWidth: '1px' }}>
            <h4 className="font-medium mb-2" style={{ color: colors.darkGray }}>How it works</h4>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              Spaced repetition shows you cards at optimal intervals. Cards you find
              hard appear more frequently, while easy cards appear less often. This
              scientifically-proven method helps you remember information long-term.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

