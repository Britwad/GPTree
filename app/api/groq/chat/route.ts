// Next.js App Router API route (route.ts)
// Put this at: app/api/groq/chat/route.ts

import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

type Message = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    // Only accept JSON POST
    const body = await req.json();
    const { messages, model = "compound-beta", temperature = 0.7 } = body as {
      messages?: Message[];
      model?: string;
      temperature?: number;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages (non-empty array) required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "server misconfiguration: GROQ_API_KEY missing" }, { status: 500 });
    }

    // Forward to Groq
    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
      }),
    });

    // If Groq returned a non-OK status, forward the details (but avoid leaking secrets)
    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: "Groq API error", status: resp.status, details: text }, { status: 502 });
    }

    // Forward the JSON response from Groq
    const json = await resp.json();
    return NextResponse.json(json);
  } catch (err: unknown) {
    console.error("Error in /api/groq/chat:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}
