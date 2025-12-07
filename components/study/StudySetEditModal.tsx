"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Edit2, Save, X as XIcon } from "lucide-react";
import { Button, Card } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

type Flashcard = {
  id: number;
  name: string;
  content: string;
  dueAt?: string;
};

interface StudySetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTitleUpdate: (title: string) => Promise<void>;
  studysetSlug: string;
  initialTitle: string;
  onFlashcardsUpdate: () => void;
}

export default function StudySetEditModal({
  isOpen,
  onClose,
  onTitleUpdate,
  studysetSlug,
  initialTitle,
  onFlashcardsUpdate,
}: StudySetEditModalProps) {
  const [title, setTitle] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [editingFlashcardId, setEditingFlashcardId] = useState<number | null>(null);
  const [editingFlashcard, setEditingFlashcard] = useState<{ name: string; content: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setError("");
      setEditingFlashcardId(null);
      setEditingFlashcard(null);
      fetchFlashcards();
    }
  }, [isOpen, initialTitle, studysetSlug]);

  const fetchFlashcards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/studysets/${studysetSlug}`);
      if (!res.ok) throw new Error("Failed to fetch studyset");
      
      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch (e) {
      console.error("Failed to fetch flashcards", e);
      setError("Failed to load flashcards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSavingTitle(true);
    setError("");
    try {
      await onTitleUpdate(title.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update title");
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcardId(flashcard.id);
    setEditingFlashcard({ name: flashcard.name, content: flashcard.content });
  };

  // Check if flashcard edit is valid
  const isFlashcardEditValid = editingFlashcard 
    ? editingFlashcard.name.trim().length > 0 && editingFlashcard.content.trim().length > 0
    : false;

  const handleSaveFlashcard = async (flashcardId: number) => {
    if (!editingFlashcard || !editingFlashcard.name.trim() || !editingFlashcard.content.trim()) {
      setError("Question and answer are required");
      return;
    }

    setError("");
    try {
      const res = await fetch(`/api/flashcards/flashcard/${flashcardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingFlashcard.name.trim(),
          content: editingFlashcard.content.trim(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update flashcard");
      }

      setEditingFlashcardId(null);
      setEditingFlashcard(null);
      await fetchFlashcards();
      onFlashcardsUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update flashcard");
    }
  };

  const handleCancelEdit = () => {
    setEditingFlashcardId(null);
    setEditingFlashcard(null);
    setError("");
  };

  const handleDeleteFlashcard = async (flashcardId: number) => {
    setIsDeleting(flashcardId);
    setError("");
    try {
      const res = await fetch(`/api/flashcards/flashcard/${flashcardId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete flashcard");
      }

      // Remove from local state instead of refetching
      setFlashcards((prev) => prev.filter((fc) => fc.id !== flashcardId));
      onFlashcardsUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete flashcard");
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: colors.darkGray }}>
            Edit Studyset
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
            style={{ color: colors.darkGray }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-2"
            style={{ color: colors.darkGray }}
          >
            Title
          </label>
          <div className="flex gap-2">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-lg px-4 py-2 focus:outline-none"
              style={{
                borderWidth: "1px",
                borderColor: error && !title.trim() ? "#ef4444" : colors.lightGray,
                backgroundColor: colors.white,
                color: colors.darkGray,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.green;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error && !title.trim() ? "#ef4444" : colors.lightGray;
              }}
              disabled={isSavingTitle}
            />
            <Button
              onClick={handleTitleSave}
              disabled={isSavingTitle || title.trim() === initialTitle}
            >
              {isSavingTitle ? "Saving..." : "Save Title"}
            </Button>
          </div>
        </div>

        {/* Flashcards Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.darkGray }}>
            Flashcards ({flashcards.length})
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "#fee2e2" }}>
              <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p style={{ color: colors.darkGray }}>Loading flashcards...</p>
            </div>
          ) : flashcards.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: colors.darkGray }}>No flashcards in this studyset.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {flashcards.map((flashcard) => (
                <Card key={flashcard.id} className="p-4">
                  {editingFlashcardId === flashcard.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>
                          Question
                        </label>
                        <input
                          type="text"
                          value={editingFlashcard?.name || ""}
                          onChange={(e) =>
                            setEditingFlashcard({ ...editingFlashcard!, name: e.target.value })
                          }
                          className="w-full rounded-lg px-3 py-2 focus:outline-none"
                          style={{
                            borderWidth: "1px",
                            borderColor: colors.lightGray,
                            backgroundColor: colors.white,
                            color: colors.darkGray,
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: colors.darkGray }}>
                          Answer
                        </label>
                        <textarea
                          value={editingFlashcard?.content || ""}
                          onChange={(e) =>
                            setEditingFlashcard({ ...editingFlashcard!, content: e.target.value })
                          }
                          rows={3}
                          className="w-full rounded-lg px-3 py-2 focus:outline-none"
                          style={{
                            borderWidth: "1px",
                            borderColor: colors.lightGray,
                            backgroundColor: colors.white,
                            color: colors.darkGray,
                          }}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveFlashcard(flashcard.id)}
                          disabled={!isFlashcardEditValid}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium mb-2" style={{ color: colors.darkGray }}>
                          {flashcard.name}
                        </p>
                        <p className="text-sm" style={{ color: colors.darkGray }}>
                          {flashcard.content}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditFlashcard(flashcard)}
                          title="Edit flashcard"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFlashcard(flashcard.id)}
                          disabled={isDeleting === flashcard.id}
                          title="Delete flashcard"
                          style={{ color: "#ef4444" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#fee2e2";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

