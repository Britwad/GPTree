"use client";

import Modal from "react-modal";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { type Node } from "@/app/generated/prisma/client";
import { CreateNode } from "@/lib/validation_schemas";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
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

  // Parse content JSON for parent node display
  let overview = "";
  let subtopics: string[] = [];
  try {
    const content = JSON.parse(node.content || "{}");
    overview = content.overview || "";
    subtopics = content.subtopics || [];
  } catch (e) {
    console.warn("Node content is not valid JSON", e);
  }

  const onSubmit = async () => {
    if (!prompt.trim()) {
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
      question: prompt.trim(),
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={`Node: ${node.question}`}
      appElement={typeof window !== "undefined" ? document.body : undefined}
    >
   
      <div className="flex flex-col gap-4">
        {/* Parent node display */}
        <div>
          <h2 className="text-xl font-bold mb-2">{node.question}</h2>
          {overview && <p className="mb-2">{overview}</p>}
          {subtopics.length > 0 && (
            <ul className="list-disc ml-5 mb-2">
              {subtopics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
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
            onClick={onSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Add"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300 transition-colors self-start"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default NodeModal;
