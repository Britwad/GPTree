"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button, Card, Checkbox } from "./StudyUIComponents";
import { colors } from "@/lib/colors";
import type { Tree } from "@/lib/App";

type ApiNode = {
  id: number;
  treeId?: number;
  tree?: { id: number };
  flashcards?: Array<{
    id: number;
    name: string;
    content: string;
  }>;
};

type Flashcard = {
  id: number;
  name: string;
  content: string;
  nodeId: number;
  treeId: number;
};

interface StudySetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, selectedFlashcardIds: number[]) => Promise<void>;
  userId: string;
}

export default function StudySetCreateModal({
  isOpen,
  onClose,
  onSubmit,
  userId,
}: StudySetCreateModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tree selection state
  const [trees, setTrees] = useState<Array<Tree & { flashcardCount: number }>>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedTreeIds, setSelectedTreeIds] = useState<number[]>([]);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setError("");
      setSelectedTreeIds([]);
      fetchFlashcards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchFlashcards = async () => {
    setIsLoadingFlashcards(true);
    try {
      // Fetch trees
      const treesRes = await fetch(`/api/trees?userId=${encodeURIComponent(userId)}`);
      const treesData = await treesRes.json();
      const treesList = treesData.trees || [];

      // Fetch nodes with flashcards
      const nodesRes = await fetch(`/api/nodes?userId=${encodeURIComponent(userId)}`);
      const nodesData = await nodesRes.json();
      const nodes: ApiNode[] = nodesData.nodes || [];

      // Map flashcards
      const allFlashcards: Flashcard[] = nodes.flatMap((n) =>
        (n.flashcards ?? []).map((f) => ({
          id: f.id,
          name: f.name,
          content: f.content,
          nodeId: n.id,
          treeId: n.treeId ?? n.tree?.id ?? 0,
        }))
      );

      // Calculate flashcard counts per tree
      const treesWithCounts = treesList.map((tree: Tree) => ({
        ...tree,
        flashcardCount: allFlashcards.filter((fc) => fc.treeId === tree.id).length,
      }));

      setTrees(treesWithCounts);
      setFlashcards(allFlashcards);
    } catch (e) {
      console.error("Failed to load flashcards", e);
      setError("Failed to load flashcards");
    } finally {
      setIsLoadingFlashcards(false);
    }
  };

  const toggleTree = (treeId: number) => {
    setSelectedTreeIds((prev) =>
      prev.includes(treeId)
        ? prev.filter((id) => id !== treeId)
        : [...prev, treeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (selectedTreeIds.length === 0) {
      setError("Please select at least one topic");
      return;
    }

    // Get all flashcard IDs from selected trees
    const selectedFlashcardIds = flashcards
      .filter((fc) => selectedTreeIds.includes(fc.treeId))
      .map((fc) => fc.id);

    if (selectedFlashcardIds.length === 0) {
      setError("Selected topics have no flashcards");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit(title.trim(), selectedFlashcardIds);
      setTitle("");
      setSelectedTreeIds([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create studyset");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: colors.darkGray }}>
            Create New Studyset
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
            style={{ color: colors.darkGray }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-2"
              style={{ color: colors.darkGray }}
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter studyset title"
              className="w-full rounded-lg px-4 py-2 focus:outline-none"
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
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Tree Selection */}
          {isLoadingFlashcards ? (
            <div className="text-center py-8">
              <p style={{ color: colors.darkGray }}>Loading topics...</p>
            </div>
          ) : trees.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4" style={{ color: colors.darkGray }}>
                No topics available. Create some trees and nodes first.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.darkGray }}>
                Select Topics
              </h3>
              <p className="text-sm mb-3" style={{ color: colors.darkGray }}>
                Select topics to include all their flashcards in the studyset.
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {trees.map((tree) => (
                  <div
                    key={tree.id}
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                    style={{ borderColor: colors.lightGray, borderWidth: "1px" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.superLightGreen;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Checkbox
                      id={`tree-${tree.id}`}
                      checked={selectedTreeIds.includes(tree.id)}
                      onCheckedChange={() => toggleTree(tree.id)}
                    />
                    <label
                      htmlFor={`tree-${tree.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <p className="font-medium" style={{ color: colors.darkGray }}>
                        {tree.name}
                      </p>
                      <p className="text-sm" style={{ color: colors.darkGray }}>
                        {tree.flashcardCount} cards
                      </p>
                    </label>
                  </div>
                ))}
              </div>
              {selectedTreeIds.length > 0 && (
                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.superLightGreen }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkGray }}>
                    {flashcards
                      .filter((fc) => selectedTreeIds.includes(fc.treeId))
                      .length} flashcards will be added from {selectedTreeIds.length} {selectedTreeIds.length === 1 ? "topic" : "topics"}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm mb-4" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedTreeIds.length === 0 || !title.trim()}
            >
              {isSubmitting
                ? "Creating..."
                : `Create Studyset${selectedTreeIds.length > 0 ? ` (${flashcards.filter((fc) => selectedTreeIds.includes(fc.treeId)).length} cards)` : ""}`}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

