"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Tree, Flashcard, AppState } from "@/lib/App";

// Utility function for className merging
function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-green-600 text-white hover:bg-green-700",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "outline" && "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "ghost" && "hover:bg-gray-100 text-gray-700",
          variant === "link" && "text-green-600 underline-offset-4 hover:underline",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card Component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          className
        )}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
          variant === "default" && "border-transparent bg-green-600 text-white hover:bg-green-700",
          variant === "secondary" && "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "destructive" && "border-transparent bg-red-600 text-white hover:bg-red-700",
          variant === "outline" && "border-gray-300 text-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// Progress Component
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-green-600 transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

type StudyPageProps = {
  trees: Tree[];
  userId: string;
  onNavigate: (page: AppState["currentPage"]) => void;
  onUpdateFlashcard: (flashcardId: number, updates: Partial<Flashcard>) => void;
};

export default function StudyPage({
  trees,
  userId,
  onNavigate,
  onUpdateFlashcard,
}: StudyPageProps) {
  const [selectedTreeIds, setSelectedTreeIds] = useState<number[]>(
    trees.map((t) => t.id)
  );
  const [studyMode, setStudyMode] = useState<"select" | "studying">("select");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [reviewedCount, setReviewedCount] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState([50]);
  const [sessionStats, setSessionStats] = useState({
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/nodes?userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        const nodes = json.nodes || [];

        const cards: Flashcard[] = nodes.flatMap((n: any) =>
          (n.flashcards || []).map((f: any) => ({
            id: f.id,
            front: f.name,
            back: f.content,
            nodeId: n.id,
            treeId: n.treeId ?? n.tree?.id ?? 0,
            interval: f.interval ?? 1,
            easeFactor: f.easeFactor ?? 2.5,
            nextReview: f.nextReview ? new Date(f.nextReview) : new Date(),
          }))
        );

        if (!cancelled) setFlashcards(cards);
      } catch (e) {
        console.error("Failed to load flashcards", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, trees]);


  // Calculate tree stats
  const treeStats = trees.map((tree) => ({
    ...tree,
    flashcardCount: flashcards.filter((fc) => fc.treeId === tree.id).length,
  }));

  // Filter flashcards based on selected trees
  const availableFlashcards = flashcards.filter(
    (fc) => selectedTreeIds.includes(fc.treeId)
  );

  useEffect(() => {
    if (studyMode === "studying" && currentCardIndex >= availableFlashcards.length) {
      setStudyMode("select");
      setCurrentCardIndex(0);
    }
  }, [currentCardIndex, availableFlashcards.length, studyMode]);

  const toggleTreeSelection = (treeId: number) => {
    setSelectedTreeIds((prev) =>
      prev.includes(treeId) ? prev.filter((id) => id !== treeId) : [...prev, treeId]
    );
  };

  const startStudying = () => {
    if (availableFlashcards.length === 0) return;
    setStudyMode("studying");
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setUserAnswer("");
    setReviewedCount(0);
    setConfidenceLevel([50]);
    setSessionStats({ hard: 0, good: 0, easy: 0 });
  };

  const handleRecall = (difficulty: "hard" | "good" | "easy") => {
    const currentCard = availableFlashcards[currentCardIndex];
    if (!currentCard) return;

    // Calculate new interval and ease factor using SM-2 algorithm
    let newInterval = currentCard.interval;
    let newEaseFactor = currentCard.easeFactor;

    if (difficulty === "hard") {
      newInterval = Math.max(1, Math.floor(currentCard.interval * 0.8));
      newEaseFactor = Math.max(1.3, currentCard.easeFactor - 0.15);
    } else if (difficulty === "good") {
      newInterval = Math.floor(currentCard.interval * newEaseFactor);
      newEaseFactor = currentCard.easeFactor;
    } else {
      newInterval = Math.floor(currentCard.interval * newEaseFactor * 1.3);
      newEaseFactor = currentCard.easeFactor + 0.1;
    }

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    onUpdateFlashcard(currentCard.id, {
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview,
    });

    setSessionStats((prev) => ({
      ...prev,
      [difficulty]: prev[difficulty] + 1,
    }));

    setReviewedCount((prev) => prev + 1);
    setShowAnswer(false);
    setUserAnswer("");
    setCurrentCardIndex((prev) => prev + 1);
  };

  const handleConfidenceSubmit = () => {
    const currentCard = availableFlashcards[currentCardIndex];
    if (!currentCard) return;

    const confidence = confidenceLevel[0];
    
    // Map confidence level to difficulty
    // 0-33: hard, 34-66: good, 67-100: easy
    let difficulty: "hard" | "good" | "easy";
    if (confidence <= 33) {
      difficulty = "hard";
    } else if (confidence <= 66) {
      difficulty = "good";
    } else {
      difficulty = "easy";
    }

    handleRecall(difficulty);
    setConfidenceLevel([50]); // Reset to middle
  };

  const handleNextCard = () => {
    if (currentCardIndex < availableFlashcards.length - 1) {
      setShowAnswer(false);
      setUserAnswer("");
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setShowAnswer(false);
      setUserAnswer("");
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  // Selection Mode
  if (studyMode === "select") {
    const totalCards = treeStats.reduce((sum, tree) => sum + tree.flashcardCount, 0);

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => onNavigate("landing")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <h1 className="text-xl text-gray-900">Spaced Repetition Study</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 max-w-5xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl mb-4 text-gray-900">Review Your Flashcards</h2>
            <p className="text-gray-600 text-lg">
              Select which topics you want to study using proven spaced repetition techniques.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-sm text-gray-600">Total Cards</p>
                  <p className="text-2xl text-gray-900">{totalCards}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-sm text-gray-600">Trees</p>
                  <p className="text-2xl text-gray-900">{trees.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tree Selection */}
          {treeStats.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="text-xl mb-2 text-gray-900">No Trees Yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first learning tree to start generating flashcards.
              </p>
              <Button onClick={() => onNavigate("dashboard")}>
                Go to Dashboard
              </Button>
            </Card>
          ) : (
            <Card className="p-6 mb-6">
              <h3 className="text-xl mb-4 text-gray-900">Select Topics to Study</h3>
              <div className="space-y-3">
                {treeStats.map((tree) => (
                <div
                  key={tree.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`tree-${tree.id}`}
                      checked={selectedTreeIds.includes(tree.id)}
                      onCheckedChange={() => toggleTreeSelection(tree.id)}
                    />
                    <label
                      htmlFor={`tree-${tree.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <p className="font-medium">{tree.name}</p>
                      <p className="text-sm text-gray-500">
                        {tree.flashcardCount} cards total
                      </p>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          )}

          {/* Start Button */}
          {treeStats.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl mb-1 text-gray-900">
                  {availableFlashcards.length} cards available
                </p>
                <p className="text-sm text-gray-600">
                  From {selectedTreeIds.length} selected{" "}
                  {selectedTreeIds.length === 1 ? "topic" : "topics"}
                </p>
              </div>
              <Button
                size="lg"
                onClick={startStudying}
                disabled={availableFlashcards.length === 0}
              >
                Start Studying
              </Button>
            </div>
          </Card>
          )}

          {/* Help Text */}
          {treeStats.length > 0 && (
          <div className="mt-8 p-4 border rounded-lg">
            <h4 className="font-medium mb-2 text-gray-900">How it works</h4>
            <p className="text-sm text-gray-600">
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

  // Completion Screen
  if (availableFlashcards.length === 0 || currentCardIndex >= availableFlashcards.length) {
    const totalReviewed = sessionStats.hard + sessionStats.good + sessionStats.easy;
    const accuracyScore =
      totalReviewed > 0
        ? Math.round(
            ((sessionStats.good + sessionStats.easy) / totalReviewed) * 100
          )
        : 0;

    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-lg w-full">
          <h2 className="text-3xl mb-2 text-gray-900">Session Complete!</h2>
          <p className="text-gray-600 mb-8">
            You've reviewed {reviewedCount} cards. Great work!
          </p>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl mb-1 text-gray-900">{sessionStats.hard}</div>
              <div className="text-sm text-gray-600">Hard</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl mb-1 text-gray-900">{sessionStats.good}</div>
              <div className="text-sm text-gray-600">Good</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl mb-1 text-gray-900">{sessionStats.easy}</div>
              <div className="text-sm text-gray-600">Easy</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Retention Score</span>
              <span className="font-medium">{accuracyScore}%</span>
            </div>
            <Progress value={accuracyScore} className="h-2" />
          </div>

          <Button size="lg" onClick={() => setStudyMode("select")} className="w-full">
            Back to Study Selection
          </Button>
        </Card>
      </div>
    );
  }

  // Studying Mode - Full Page Experience
  const currentCard = availableFlashcards[currentCardIndex];
  const progressPercent = ((currentCardIndex + 1) / availableFlashcards.length) * 100;
  const currentTree = trees.find((t) => t.id === currentCard.treeId);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStudyMode("select")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Study
              </Button>
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium text-gray-900">{currentTree?.name || "Study Session"}</p>
                  <p className="text-xs text-gray-500">
                    Card {currentCardIndex + 1} of {availableFlashcards.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  {sessionStats.hard}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  {sessionStats.good}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  {sessionStats.easy}
                </Badge>
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Question Section */}
          <div className="p-8 border-b">
            <p className="text-sm uppercase tracking-wide text-gray-600 mb-4">
              Concept Question
            </p>
            <div className="rounded-xl p-6 border">
              <p className="text-xl leading-relaxed text-gray-900">{currentCard.front}</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="px-8 py-4 bg-gray-50 border-b flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousCard}
              disabled={currentCardIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex gap-1.5">
              {availableFlashcards.slice(0, 10).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentCardIndex
                      ? "bg-emerald-600"
                      : index < currentCardIndex
                      ? "bg-gray-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
              {availableFlashcards.length > 10 && (
                <span className="text-xs text-gray-500 ml-2">
                  +{availableFlashcards.length - 10}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextCard}
              disabled={currentCardIndex === availableFlashcards.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Answer Section */}
          <div className="p-8">
            {!showAnswer ? (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Your Answer (Optional - helps with active recall)
                  </label>
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here before revealing..."
                    className="min-h-[140px] resize-none text-base"
                  />
                </div>
                <Button
                  onClick={() => setShowAnswer(true)}
                  size="lg"
                  className="w-full h-14"
                >
                  Show Answer
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Correct Answer */}
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-600 mb-4">
                    Correct Answer
                  </p>
                  <div className="rounded-xl p-6 border">
                    <p className="text-xl leading-relaxed text-gray-900">{currentCard.back}</p>
                  </div>
                </div>

                {/* User's Answer Comparison */}
                {userAnswer && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Your answer:</p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-wrap">{userAnswer}</p>
                    </div>
                  </div>
                )}

                {/* Confidence Level Rating */}
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    RATE DIFFICULTY [CONFIDENCE]
                  </p>
                  <div className="mb-6">
                    {/* Gradient Confidence Bar Container */}
                    <div className="relative h-16">
                      {/* Gradient Bar Background */}
                      <div className="absolute inset-0 flex w-full overflow-hidden rounded-lg">
                        <div className="h-full" style={{ width: '20%', backgroundColor: '#dc2626' }} />
                        <div className="h-full" style={{ width: '20%', backgroundColor: '#ea580c' }} />
                        <div className="h-full" style={{ width: '20%', backgroundColor: '#eab308' }} />
                        <div className="h-full" style={{ width: '20%', backgroundColor: '#84cc16' }} />
                        <div className="h-full" style={{ width: '20%', backgroundColor: '#16a34a' }} />
                      </div>
                      {/* Slider with custom styling */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={confidenceLevel[0]}
                        onChange={(e) => setConfidenceLevel([parseInt(e.target.value)])}
                        className="w-full h-16 bg-transparent appearance-none cursor-pointer absolute top-0 left-0 z-10"
                        style={{
                          WebkitAppearance: 'none',
                          background: 'transparent',
                        }}
                      />
                    </div>
                    {/* Current confidence value display */}
                    <div className="text-center text-3xl font-bold text-gray-900 mt-4">
                      {confidenceLevel[0]}%
                    </div>
                  </div>
                  <Button
                    onClick={handleConfidenceSubmit}
                    size="lg"
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Rate honestly to optimize your learning. The SM-2 algorithm adjusts review
            intervals based on your confidence.
          </p>
        </div>
      </main>
    </div>
  );
}