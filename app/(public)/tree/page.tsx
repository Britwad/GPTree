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

  // Submit prompt handler
  const onSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: prompt, userId: session?.user?.id }),
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
    if (e.key === "Enter") {
      onSubmit();
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
            onChange={(e) => setPrompt(e.target.value)}
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
            disabled={loading}
            className="px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 font-semibold"
            style={{
              fontFamily: 'var(--font-inter)',
              backgroundColor: loading ? colors.green : colors.green,
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.darkGreen)}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.green)}
          >
            {loading ? "Creating..." : "Go"}
          </button>
        </div>
        
        {error && <p className="text-center" style={{ fontFamily: 'var(--font-inter)', color: colors.darkGray }}>{error}</p>}
      </div>
    </div>
  );
  
}
