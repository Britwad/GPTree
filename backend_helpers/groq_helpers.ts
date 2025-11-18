import prisma from "@/lib/prisma";
import { StructuredNodeSchema, FlashcardsSchema, FlashcardInput, StructuredNode, CreateNode } from "@/lib/validation_schemas";
import Groq from "groq-sdk";
import { createFlashcards } from "./prisma_helpers";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export type Message = { role: "system" | "user" | "assistant" | "developer"; content: string };

export async function getGroqChatCompletion(
  messages: Message[],
  model = "compound-beta"
) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const resp = await groq.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 500,
    stream: false, // This is NOT a streaming request
  });

  const content = resp?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned an empty response");
  }
  return content;
}

export async function generateFlashcards(params: {
    nodeName: string, 
    nodeContent: string,}): Promise<FlashcardInput[]> {
    const {nodeName, nodeContent} = params;

    const systemPrompt = `You are an assistant that extracts the most helpful study flashcards for the following content.
                        Output JSON only: an array of objects with keys "keyword" and "definition".
                        - keyword: a short phrase (1-3 words)
                        - definition: 1-2 sentences defining or explaining it.
                        Return between 4 and 8 cards. JSON only.`;

    const userPrompt = `Create flashcards for this node content:\n\nTitle: ${nodeName}\n\nContent:\n${nodeContent}`;

    const raw = await getGroqChatCompletion([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
    ]);

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        const first = raw.indexOf('[');
        const last = raw.lastIndexOf(']');
        parsed = JSON.parse(raw.slice(first, last + 1));
    }

    const validationResult = FlashcardsSchema.safeParse(parsed);

    if (!validationResult.success) {
        console.error("Flashcard generation validation error:", validationResult.error);
        return [];
    }

    return validationResult.data;
}



/**
 * 
 * @param messages The messages we want to give Groq. Should contain a system
 * prompt and a user prompt
 * @param params The parameters for creating a node in the database
 * @returns 
 */
export async function groqNodeAndFlashcards(messages: Message[], params: CreateNode) {
    try {
        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("messages (non-empty array) required");
        }

        // Check Groq API key
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("server misconfiguration: GROQ_API_KEY missing");
        }

        // Forward to Groq
        const upstream = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
            temperature: 0.7,
            stream: true,
        });

        // We need a way to store the LLM output in our database as it streams
        // so we will hold it in this variable and append to it as we go
        let fullResponse = "";
        // Now we want to make a readable stream to return
        return new ReadableStream({
            async start(controller) {
                try {
                    // We read from the stream from Groq one chunk at a time
                    for await (const chunk of upstream) {
                        // If that chunk has content, we enqueue it
                        // (i.e. push it into the stream to the client)
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) controller.enqueue(new TextEncoder().encode(content));

                        // We also append it to the full response
                        fullResponse += content || "";
                    }

                    // Our stream is over, so we can store the full response
                    const node = await storeResponseAsNode(parseStructuredNode(fullResponse), params);

                    // Then we make flashcards for it
                    await createFlashcards(node);

                } catch (err) {
                    // If there's an error, we report it
                    controller.error(err);
                } finally {
                    // And we close the stream when done
                    controller.close();
                }
            },
        });
    } catch (err: unknown) {
        console.error("Error getting a response from Groq:", err);
        throw err;
    }
}

// Helper function for storing a response in our database
async function storeResponseAsNode(response: StructuredNode, params: CreateNode) {
    // Create the node in the database
    const node = await prisma.node.create({
        data: {
            name: response.name,
            question: params.question,
            content: response.content,
            followups: response.followups,
            treeId: params.treeId,
            userId: params.userId,
            parentId: params.parentId,
        },
    });

    return node;
}

// Helper function for parsing
export function parseStructuredNode(content: string): StructuredNode {
    let parsed: unknown;
    try {
        const trimmed = content.trim();
        parsed = JSON.parse(trimmed);
    } catch (e) {
        throw new Error("Failed to parse node content as JSON: " + (e instanceof Error ? e.message : String(e)));
    }
    // Validate the parsed object with Zod
    const r = StructuredNodeSchema.safeParse(parsed);
    if (!r.success) {
        console.error("Validation errors:", r.error.format());
        throw new Error("Parsed node content does not match expected schema: " + JSON.stringify(r.error.format()));
    }
    return r.data;
}

// Note for the future: Implement jsdoc comments for all functions
/** This function wraps our general response helper gives back a stream
 *  for the conent of a new node
 * @param prompt The prompt to send to the LLM
 * @param params The parameters for creating the node (See {@link CreateNode } type)
 * @returns A ReadableStream that streams the LLM response
*/
export async function generateNodeStream(prompt: string, params: CreateNode) {

    // Generate content for the root node based on the prompt
    // We're streaming to the backend right now but eventually
    // we will stream to the client
    const stream = await groqNodeAndFlashcards([
        { role: "system", content: nodeSystemPrompt },
        { role: "user", content: `I want to learn about: ${prompt}.` }
    ], params);

    return stream;
}

export const groqNodeResponseStructure = {
  type: "json_schema",
  json_schema: {
    name: "node_text",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["success", "clarify"] },
        name: { type: "string" },
        content: { type: "string" },
        followups: { type: "array", items: { type: "string" } },
      },
      required: ["status", "name", "content", "followups"],
      additional_properties: false,
    },
  },
};

export const nodeSystemPrompt = `
You are a knowledgeable and patient instructor who helps users build a structured "learning tree."
Always reply with a single valid JSON object containing exactly these fields:

{
  "status": "success" | "clarify",
  "name": "short title (1–4 words)",
  "content": "markdown-formatted explanation or clarifying question",
  "followups": ["question 1", "question 2", ...]
}

Behavior:
- "status": "success" → the user’s question is educational and you can answer it directly.
- "status": "clarify" → the user’s question is vague, off-topic, or not clearly educational.
  • In this case, write one short clarifying question in "content" that guides the user back on track.
  • "followups" may include up to 3 optional answers to “Did you mean…?” that reinterprets the query into concrete educational questions.
  • Example: ["Teach me about biological trees", "Explain the trees data structure"]

Formatting for "content":
- Use readable GitHub-Flavored Markdown (headings, short paragraphs, bullet points).
- Use real newlines, never literal "\\n".
- Only use fenced code blocks when you must show actual code or math.
- Avoid wrapping the entire output in backticks.
- Keep total length under 500 words.

Formatting for "followups":
- In "success": 2–5 concise, distinct educational follow-up questions.
- In "clarify": 0–3 optional suggestions for directed questions.

Output **only** the JSON. No preamble, commentary, or backticks.

Example (success):
{
  "status": "success",
  "name": "Understanding Gravity",
  "content": "Gravity is the force that pulls...",
  "followups": [
    "How does gravity affect time?",
    "What did Einstein contribute to our understanding of gravity?"
  ]
}

Example (clarify):
{
  "status": "clarify",
  "name": "Clarification Needed",
  "content": "Could you clarify what kind of trees you mean — biological or data structures?",
  "followups": [
    "Did you mean the biological growth of trees?",
    "Did you mean binary trees in computer science?"
  ]
}
`;
