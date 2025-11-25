"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { type Node } from "@/app/generated/prisma/client";
import { CreateNode } from "@/lib/validation_schemas";
import MarkdownRenderer from "@/components/Generic/MarkdownRenderer";
import { colors } from "@/lib/colors";

export default function ConversationPanel({
  node,
  onNewNode,
  streamingQuestion,
  streamingContent,
  streamingFollowups,
  streamingIsOpen
}: {
  node: Node | null;
  onNewNode: (newNode: CreateNode) => void;
  streamingQuestion?: string;
  streamingContent?: string;
  streamingFollowups?: string[];
  streamingIsOpen?: boolean;
}) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nodeQuestion = node?.question || streamingQuestion || "";

  const onSubmit = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || prompt;

    if (!node && !streamingIsOpen) {
      alert("No node selected (How did you get here?");
      return;
    }
    if (!promptToUse.trim()) {
      alert("Question cannot be empty");
      return;
    }
    if (!session?.user?.id) {
      alert("You must be signed in");
      return;
    }

    const parentId = node?.id;
    const treeId = node?.treeId;

    if (!treeId) {
      alert("Missing treeId");
      return;
    }

    setIsLoading(true);

    const body: CreateNode = {
      question: promptToUse.trim(),
      userId: session.user.id,
      treeId,
      parentId,
    };

    try {
      setPrompt("");
      onNewNode(body);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  /*Panel reflects the same layout as node popup did*/
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      
      {/* HEADER */}
      <div
        className="pb-4"
        style={{ borderBottomColor: colors.lightGray, borderBottomWidth: "1px" }}
      >
        <h2 className="text-2xl font-bold">{nodeQuestion || "Select a node"}</h2>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto py-4">

        {/* Node content */}
        {node?.content && (
          <div className="mb-6">
            <MarkdownRenderer content={node.content} />
          </div>
        )}

        {/* Streaming content */}
        {streamingIsOpen && !node && streamingContent && (
          <div className="mb-6">
            <MarkdownRenderer content={streamingContent} />
          </div>
        )}

        {/* Follow-ups */}
        {(node?.followups || (streamingIsOpen && streamingFollowups)) && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Suggested Follow-ups</h3>

            <div className="flex flex-col gap-2">
              {(node?.followups || streamingFollowups || []).map((question, i) => (
                <button
                  key={i}
                  onClick={() => onSubmit(question)}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderWidth: "2px",
                    borderColor: colors.lightGray,
                    backgroundColor: colors.white,
                    color: colors.darkGray,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.green;
                    e.currentTarget.style.backgroundColor = colors.superLightGreen;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.lightGray;
                    e.currentTarget.style.backgroundColor = colors.white;
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER INPUT */}
      {(node || streamingIsOpen) && (
        <div
          className="pt-4 flex gap-2 items-center"
          style={{ borderTopColor: colors.lightGray, borderTopWidth: "1px" }}
        >
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter follow-up question"
            disabled={isLoading}
            className="flex-1 rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderWidth: "2px",
              borderColor: colors.lightGray,
              color: colors.darkGray,
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = colors.green)
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = colors.lightGray)
            }
          />

          <button
            onClick={() => onSubmit()}
            disabled={isLoading}
            className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.green }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = colors.darkGreen)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = colors.green)
            }
          >
            {isLoading ? "Creating..." : "Submit"}
          </button>
        </div>
      )}
    </div>
  );
}
