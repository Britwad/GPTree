import React from "react";
import GroqChat from "../../components/GroqChat";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Groq Chat</h1>
      <p>Simple client that talks to <code>/api/groq/chat</code></p>
      <GroqChat />
    </main>
  );
}
