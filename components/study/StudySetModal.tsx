"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button, Card } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

interface StudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
  initialTitle?: string;
  mode: "create" | "edit";
}

export default function StudySetModal({
  isOpen,
  onClose,
  onSubmit,
  initialTitle = "",
  mode,
}: StudySetModalProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setError("");
    }
  }, [isOpen, initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim());
      setTitle("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save studyset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: colors.darkGray }}>
            {mode === "create" ? "Create New Studyset" : "Edit Studyset"}
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
          <div className="mb-4">
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
                borderColor: error ? "#ef4444" : colors.lightGray,
                backgroundColor: colors.white,
                color: colors.darkGray,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.green;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? "#ef4444" : colors.lightGray;
              }}
              disabled={isSubmitting}
              autoFocus
            />
            {error && (
              <p className="text-sm mt-1" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

