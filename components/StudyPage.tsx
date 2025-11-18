"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Tree, Flashcard, AppState } from "@/lib/App";
import { colors } from "@/lib/colors";

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
          variant === "default" && `text-white hover:opacity-90`,
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "outline" && "border",
          variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
          variant === "ghost" && "hover:bg-gray-100",
          variant === "link" && "underline-offset-4 hover:underline",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        style={{
          ...(variant === "default" ? { backgroundColor: colors.green } : {}),
          ...(variant === "outline" ? { borderColor: colors.lightGray, color: colors.darkGray } : {}),
          ...(variant === "ghost" ? { color: colors.darkGray } : {}),
          ...(variant === "link" ? { color: colors.green } : {}),
        }}
        onMouseEnter={(e) => {
          if (variant === "default") {
            e.currentTarget.style.backgroundColor = colors.darkGreen;
          } else if (variant === "outline") {
            e.currentTarget.style.backgroundColor = colors.superLightGreen;
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "default") {
            e.currentTarget.style.backgroundColor = colors.green;
          } else if (variant === "outline") {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
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
      "rounded-lg border shadow-sm",
      className
    )}
    style={{ borderColor: colors.lightGray, backgroundColor: colors.white }}
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
          "h-4 w-4 rounded border focus:ring-2 focus:ring-offset-2",
          className
        )}
        style={{ borderColor: colors.lightGray, accentColor: colors.green }}
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
          variant === "default" && "text-white",
          variant === "secondary" && "hover:bg-gray-200",
          variant === "destructive" && "border-transparent bg-red-600 text-white hover:bg-red-700",
          className
        )}
        style={{
          ...(variant === "default" ? { backgroundColor: colors.green, borderColor: colors.green } : {}),
          ...(variant === "secondary" ? { backgroundColor: colors.lightGray, color: colors.darkGray } : {}),
          ...(variant === "outline" ? { borderColor: colors.lightGray, color: colors.darkGray } : {}),
        }}
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
          "relative h-4 w-full overflow-hidden rounded-full",
          className
        )}
        style={{ backgroundColor: colors.lightGray }}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all"
          style={{ backgroundColor: colors.green, transform: `translateX(-${100 - percentage}%)` }}
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
          "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{ borderColor: colors.lightGray, color: colors.darkGray }}
        placeholder="Type your answer here before revealing..."
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

  // Add keyboard navigation for arrow keys
  useEffect(() => {
    if (studyMode !== "studying") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys if not typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentCardIndex > 0) {
          setShowAnswer(false);
          setUserAnswer("");
          setCurrentCardIndex((prev) => prev - 1);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentCardIndex < availableFlashcards.length - 1) {
          setShowAnswer(false);
          setUserAnswer("");
          setCurrentCardIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [studyMode, currentCardIndex, availableFlashcards.length]);

  // Selection Mode
  if (studyMode === "select") {
    const totalCards = treeStats.reduce((sum, tree) => sum + tree.flashcardCount, 0);

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

          {/* Stats Overview */}
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

          {/* Tree Selection */}
          {treeStats.length === 0 ? (
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
                {treeStats.map((tree) => (
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
                      onCheckedChange={() => toggleTreeSelection(tree.id)}
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

          {/* Start Button */}
          {treeStats.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl mb-1" style={{ color: colors.darkGray }}>
                  {availableFlashcards.length} cards available
                </p>
                <p className="text-sm" style={{ color: colors.darkGray }}>
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
    <div style={{ backgroundColor: colors.superLightGreen, minHeight: '100vh' }}>
      {/* Header */}
      <header className="sticky top-0 z-10" style={{ backgroundColor: colors.white, borderBottomColor: colors.borderGreen, borderBottomWidth: '2px' }}>
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
                  <p className="font-medium" style={{ color: colors.darkGray }}>{currentTree?.name || "Study Session"}</p>
                  <p className="text-xs" style={{ color: colors.darkGray }}>
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
        <div className="rounded-2xl shadow-lg overflow-hidden" style={{ backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: '1px' }}>
          {/* Question Section */}
          <div className="p-8" style={{ borderBottomColor: colors.lightGray, borderBottomWidth: '1px' }}>
            <p className="text-sm uppercase tracking-wide mb-4" style={{ color: colors.darkGray }}>
              Concept Question
            </p>
            <div className="rounded-xl p-6" style={{ borderColor: colors.lightGray, borderWidth: '1px' }}>
              <p className="text-xl leading-relaxed" style={{ color: colors.darkGray }}>{currentCard.front}</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="px-8 py-4 flex items-center justify-between" style={{ backgroundColor: colors.superLightGreen, borderBottomColor: colors.lightGray, borderBottomWidth: '1px' }}>
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
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: index === currentCardIndex ? colors.green : index < currentCardIndex ? colors.lightGray : colors.lightGray
                  }}
                />
              ))}
              {availableFlashcards.length > 10 && (
                <span className="text-xs ml-2" style={{ color: colors.darkGray }}>
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
                  <label className="text-sm mb-2 block" style={{ color: colors.darkGray }}>
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
                  <p className="text-sm uppercase tracking-wide mb-4" style={{ color: colors.darkGray }}>
                    Correct Answer
                  </p>
                  <div className="rounded-xl p-6" style={{ borderColor: colors.lightGray, borderWidth: '1px' }}>
                    <p className="text-xl leading-relaxed" style={{ color: colors.darkGray }}>{currentCard.back}</p>
                  </div>
                </div>

                {/* User's Answer Comparison */}
                {userAnswer && (
                  <div>
                    <p className="text-sm mb-2" style={{ color: colors.darkGray }}>Your answer:</p>
                    <div className="rounded-lg p-4" style={{ backgroundColor: colors.superLightGreen, borderColor: colors.lightGray, borderWidth: '1px' }}>
                      <p className="whitespace-pre-wrap" style={{ color: colors.darkGray }}>{userAnswer}</p>
                    </div>
                  </div>
                )}

                {/* Confidence Level Rating */}
                <div>
                  <p className="text-lg font-semibold mb-4" style={{ color: colors.darkGray }}>
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
                        <div className="h-full" style={{ width: '20%', backgroundColor: colors.green }} />
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
                    <div className="text-center text-3xl font-bold mt-4" style={{ color: colors.darkGray }}>
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
        <div className="mt-6 text-center text-sm" style={{ color: colors.darkGray }}>
          <p>
            Rate honestly to optimize your learning. The SM-2 algorithm adjusts review
            intervals based on your confidence.
          </p>
        </div>
      </main>
    </div>
  );
}