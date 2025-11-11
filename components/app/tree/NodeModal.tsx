"use client";

import Modal from "react-modal";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { type Node } from "@/app/generated/prisma/client";
import { CreateNode } from "@/lib/validation_schemas";
import MarkdownRenderer from "@/components/Generic/MarkdownRenderer";

const customStyles = {
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
}: {
  isOpen?: boolean;
  node: Node;
  onClose: () => void;
  onNewNode?: (newNode: Node) => void;
}) => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!node) return null;

  const onSubmit = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || prompt;
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

    const body: CreateNode = {
      question: promptToUse.trim(),
      userId: session.user.id,
      treeId: node.treeId,
      parentId: node.id,
    };

    console.log("Creating node:", body);

    try {
      const res = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to create node:", data);
        alert(data?.error || "Failed to create node");
        return;
      }

      setPrompt(""); // Clear input
      onNewNode?.(data.node); // Notify parent
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

  console.log(node.content);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles as any}
      contentLabel={`Node: ${node.question}`}
      appElement={typeof window !== "undefined" ? document.body : undefined}
    >
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

      <div className="flex flex-col gap-4">
        {/* Node content display */}
        <div>
          <h2 className="text-xl font-bold mb-2">{node.question}</h2>
          {node.content && (
            <div className="mb-2">
              <MarkdownRenderer content={node.content} />
            </div>
          )}
        </div>

        {/* Input to create follow-up */}
        <div className="flex gap-2 items-center">
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

        {/* Pre-generated follow-ups */}
        {node.followups.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Suggested Follow-ups</h3>
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
      </div>
    </Modal>
  );
};

export default NodeModal;
