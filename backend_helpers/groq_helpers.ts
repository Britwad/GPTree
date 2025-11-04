const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
type Message = { role: "system" | "user" | "assistant"; content: string };

// General method to get a response from Groq
export async function getGroqResponse(messages: Message[]) {
  try {
    // Set up the body for fetch
    const body = { messages, model: "compound-beta", temperature: 0.7 };

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("messages (non-empty array) required");
    }

    // Set up API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("server misconfiguration: GROQ_API_KEY missing");
    }

    // Forward to Groq
    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model,
        messages: body.messages,
        temperature: body.temperature,
      }),
    });

    // If Groq returned a non-OK status, forward the details (but avoid leaking secrets)
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Groq API error: ${text}`);
    }

    // Forward the JSON response from Groq
    return await resp.json(); // ?? (different return type maybe?)
  } catch (err: unknown) {
    console.error("Error getting a response from Groq:", err);
    throw err;
  }
}
