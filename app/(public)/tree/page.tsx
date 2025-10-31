"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export default function App() {

  const { data: session } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
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

    // On success, navigate to the newly created tree page
    router.push(`/tree/${data.tree.hash}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you want to learn about?"
          className="w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-gray-300 focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Go
        </button>
      </div>
    </div>
  );
}