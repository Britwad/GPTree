"use client";

import React, { useState } from "react";

export default function GroqChat() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      ...history,
      { role: "user", content: prompt },
    ];

    try {
      const res = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError((data && data.error) || "Unknown error");
        setLoading(false);
        return;
      }

      // Groq response shape may differ; inspect data to adapt.
      // Common pattern: data.choices[0].message.content
      const assistantText =
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.text ??
        JSON.stringify(data);

      setHistory((h) => [...h, { role: "user", content: prompt }, { role: "assistant", content: assistantText }]);
      setPrompt("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          rows={4}
          style={{ width: "100%" }}
        />
      </div>

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>

      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

      <div style={{ marginTop: 18 }}>
        {history.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong style={{ textTransform: "capitalize" }}>{m.role}:</strong>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
