"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

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
      body: JSON.stringify({ name: prompt, userId: session?.user?.id, prompt }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError((data && data.error) || "Unknown error");
      setLoading(false);
      return;
    }

    // Mutate the SWR cache to refresh the tree list in the sidebar
    mutate(`/api/trees?userId=${session?.user?.id}&limit=10&offset=0`);

    router.push(`/tree/${data.tree.hash}`);
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
    <div className="flex items-center justify-center h-screen">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you want to learn about?"
          className="w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Go"}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
  
}
