"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { TreeSchema } from "@/lib/validation_schemas";
import { colors } from "@/lib/colors";

export default function App() {
  const { data: session } = useSession();
  const router = useRouter();

  // State for prompt input
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if prompt is valid (not empty or whitespace only)
  const isPromptValid = prompt.trim().length > 0;

  // Submit prompt handler
  const onSubmit = async () => {
    // Validate input before submitting
    if (!isPromptValid) {
      setError("Please enter a topic to explore");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await fetch("/api/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ name: prompt.trim(), userId: session?.user?.id }),
    });

    const data = await res.json();
    const tree = TreeSchema.safeParse(data);
    if (!res.ok || !tree.success) {
      setError((data && data.error) || (data && tree.error) || "Unknown error");
      setLoading(false);
      return;
    }

    // Mutate the SWR cache to refresh the tree list in the sidebar
    mutate(`/api/trees?userId=${session?.user?.id}&limit=10&offset=0`);

    console.log("Created tree:", data);
    router.push(`/tree/${data.hash}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isPromptValid && !loading) {
      onSubmit();
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Render prompt page first if prompt not submitted yet
  if (!session) {
    return <p className="text-center mt-10">Please sign in to use this feature.</p>;
  }

  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: colors.superLightGreen }}>
      <div className="flex flex-col gap-8 items-center max-w-2xl px-6">
        <div className="text-center space-y-3">
          <h1 className="text-6xl font-bold" style={{ fontFamily: 'var(--font-inter)', color: colors.darkGray }}>
            Create a New Tree
          </h1>
          <p className="text-xl" style={{ fontFamily: 'var(--font-inter)', color: colors.darkGray }}>
            What would you like to explore?
          </p>
        </div>
        
        <div className="flex gap-3 w-full max-w-md">
          <input
            value={prompt}
            onChange={handlePromptChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter a topic..."
            disabled={loading}
            className="flex-1 border-2 rounded-lg px-4 py-3 transition-all"
            style={{
              fontFamily: 'var(--font-inter)',
              borderColor: colors.green,
              backgroundColor: colors.white,
              color: colors.darkGray,
              outline: 'none',
              boxShadow: `0 0 0 0px rgba(0,0,0,0)`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.lightGreen}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = `0 0 0 0px rgba(0,0,0,0)`;
            }}
          />
          <button
            onClick={onSubmit}
            disabled={loading || !isPromptValid}
            className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            style={{
              fontFamily: 'var(--font-inter)',
              backgroundColor: (loading || !isPromptValid) ? colors.lightGray : colors.green,
            }}
            onMouseEnter={(e) => {
              if (!loading && isPromptValid) {
                e.currentTarget.style.backgroundColor = colors.darkGreen;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && isPromptValid) {
                e.currentTarget.style.backgroundColor = colors.green;
              }
            }}
          >
            {loading ? "Creating..." : "Go"}
          </button>
        </div>
        
        {error && <p className="text-center" style={{ fontFamily: 'var(--font-inter)', color: '#ef4444' }}>{error}</p>}
      </div>
    </div>
  );
  
}
