"use client";

import Modal from "react-modal";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { type Node } from "@/app/generated/prisma/client";
import { CreateNode } from "@/lib/validation_schemas";
import MarkdownRenderer from "@/components/Generic/MarkdownRenderer";

import type { Styles } from "react-modal";

const customStyles: Styles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // Make the modal fill most of the viewport while keeping sensible maximums
    width: "80vw",
    height: "90vh",
    maxWidth: "1400px",
    maxHeight: "90vh",
    padding: "24px",
    borderRadius: "10px",
    overflowY: "auto",
    position: "relative",
    // boxSizing removed to satisfy react-modal Styles type
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
  },
};

const NodeModal = ({
  isOpen = true,
  node,
  onClose,
  onNewNode,
  streamingQuestion,
  streamingContent,
  streamingFollowups,
  streamingIsOpen
}: {
  isOpen?: boolean;
  node: Node | null;
  onClose: () => void;
  onNewNode: (newNode: CreateNode) => void;
  streamingQuestion?: string;
  streamingContent?: string;
  streamingFollowups?: string[];
  streamingIsOpen?: boolean;
}) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const nodeQuestion = node ? node.question || "" : streamingQuestion || "";

  const onSubmit = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || prompt;
    if (!node) {
      alert("No node selected (How did you get here?)");
      return;
    }

    if (!promptToUse.trim()) {
      alert("Question cannot be empty");
      return;
    }
    if (!session?.user?.id) {
      alert("You must be signed in to create a node");
      return;
    }
    if (!node.treeId) {
      alert("Parent node missing treeId");
      return;
    }

    setIsLoading(true);

    // Prepare new node data
    const body: CreateNode = {
      question: promptToUse.trim(),
      userId: session.user.id,
      treeId: node.treeId,
      parentId: node.id,
    };

    console.log("Creating node:", body);

    // Tell the parent to handle the new node creation
    try { // Maybe delete this try-finally block later
      setPrompt(""); // Clear input
      onNewNode(body);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={`Node: ${nodeQuestion}`}
      appElement={typeof window !== "undefined" ? document.body : undefined}
    >
      <div className="flex flex-col h-full">
        {/* Close button - X icon in top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">{nodeQuestion}</h2>
        </div>

        {/* Content area - scrollable */}
        <div className="flex-1 overflow-auto py-4">
          {/* Node content display */}
          {node && node.content && (
            <div className="mb-6">
              <MarkdownRenderer content={node.content} />
            </div>
          )}
          {streamingIsOpen && !node && streamingContent && (
            <div className="mb-6">
              <MarkdownRenderer content={streamingContent || ""} />
            </div>
          )}

          {/* Pre-generated follow-ups */}
          {node && node.followups && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Suggested Follow-ups</h3>
              <div className="flex flex-col gap-2">
                {node.followups.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => onSubmit(question)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
          {streamingIsOpen && !node && streamingFollowups && streamingFollowups.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Suggested Follow-ups</h3>
              <div className="flex flex-col gap-2">
                {streamingFollowups.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => onSubmit(question)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Input to create follow-up */}
        <div className="pt-4 border-t border-gray-200 flex gap-2 items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter follow-up question"
            disabled={isLoading}
            className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => onSubmit()}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NodeModal;
