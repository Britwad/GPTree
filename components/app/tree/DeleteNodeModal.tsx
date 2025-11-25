"use client";

import { type Node } from "@prisma/client";
import { Trash, TrashSimple, X } from "phosphor-react";
import { colors } from "@/lib/colors";

interface DeleteNodeModalProps {
  node: Node;
  isOpen: boolean;
  isDeleting: boolean;
  hasChildren: boolean;
  isRootNode: boolean;
  onClose: () => void;
  onDelete: (deleteMode: "node" | "branch") => void;
}

export default function DeleteNodeModal({
  node,
  isOpen,
  isDeleting,
  hasChildren,
  isRootNode,
  onClose,
  onDelete,
}: DeleteNodeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onClick={() => !isDeleting && onClose()}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: colors.lightGray }}>
          <h2 className="text-lg font-bold" style={{ color: colors.darkGray }}>
            Are you sure you want to delete this {isRootNode ? "tree" : "node"}?
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.darkGray }}>
            &ldquo;{node.question}&rdquo;
          </p>
        </div>
        <button
          onClick={() => !isDeleting && onClose()}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors disabled:opacity-50"
          style={{ color: colors.darkGray }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.superLightGreen)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <X size={20} weight="bold" />
        </button>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-end">
            {isRootNode ? (
              // Root node - only delete tree option
              <button
                onClick={() => onDelete("node")}
                disabled={isDeleting}
                className="px-4 py-3 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                style={{ backgroundColor: "#dc2626" }}
                onMouseEnter={(e) =>
                  !isDeleting && (e.currentTarget.style.backgroundColor = "#991b1b")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
              >
                <TrashSimple size={18} weight="bold" />
                {isDeleting ? "Deleting..." : "Delete Tree"}
              </button>
            ) : (
              // Non-root node - show options
              <>
                <button
                  onClick={() => onDelete("node")}
                  disabled={isDeleting}
                  className="px-4 py-3 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  style={{ backgroundColor: colors.green }}
                  onMouseEnter={(e) =>
                    !isDeleting && (e.currentTarget.style.backgroundColor = colors.darkGreen)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.green)
                  }
                >
                  <Trash size={18} weight="bold" />
                  {isDeleting ? "Deleting..." : "Delete Node"}
                </button>

                {hasChildren && (
                  <>
                    <button
                      onClick={() => onDelete("branch")}
                      disabled={isDeleting}
                      className="px-4 py-3 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                      style={{ backgroundColor: "#dc2626" }}
                      onMouseEnter={(e) =>
                        !isDeleting && (e.currentTarget.style.backgroundColor = "#991b1b")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#dc2626")
                      }
                    >
                      <TrashSimple size={18} weight="bold" />
                      {isDeleting ? "Deleting..." : "Delete Branch"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}