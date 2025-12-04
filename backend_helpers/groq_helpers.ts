import prisma from "@/lib/prisma";
import { StructuredNodeSchema, FlashcardsSchema, FlashcardInput, StructuredNode, CreateNode, UpdateNode, CreatedFlashcard } from "@/lib/validation_schemas";
import Groq from "groq-sdk";
import { type Node } from "@prisma/client";

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

// Generic function to handle streaming from Groq and processing the result
async function streamGroqResponse(
    messages: Message[],
    onComplete: (fullResponse: string) => Promise<Node>
) {
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

        let fullResponse = "";
        return new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of upstream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) controller.enqueue(new TextEncoder().encode(content));
                        fullResponse += content || "";
                    }

                    const node = await onComplete(fullResponse);
                    await createFlashcards(node);

                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });
    } catch (err: unknown) {
        console.error("Error getting a response from Groq:", err);
        throw err;
    }
}

/**
 * 
 * @param messages The messages we want to give Groq. Should contain a system
 * prompt and a user prompt
 * @param params The parameters for creating a node in the database
 * @returns 
 */
export async function groqNodeAndFlashcards(messages: Message[], params: CreateNode) {
    return streamGroqResponse(messages, async (fullResponse) => {
        return storeResponseAsNode(parseStructuredNode(fullResponse), params);
    });
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
            status: response.status,
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
 * @param history The conversation history leading up to this node
 * @returns A ReadableStream that streams the LLM response
*/
export async function generateNodeStream(prompt: string, params: CreateNode, history: Message[] = []) {

    // Generate content for the root node based on the prompt
    // We're streaming to the backend right now but eventually
    // we will stream to the client
    const messages = [
        { role: "system", content: nodeSystemPrompt },
        ...history,
        { role: "user", content: `I want to learn about: ${prompt}.` }
    ] as Message[];
    return await groqNodeAndFlashcards(messages, params);
}

async function updateResponseAsNode(response: StructuredNode, params: UpdateNode) {
    const node = await prisma.node.update({
        where: { id: params.nodeId },
        data: {
            name: response.name,
            question: params.question,
            content: response.content,
            followups: response.followups,
            status: response.status,
        },
    });
    return node;
}

export async function generateUpdateNodeStream(prompt: string, params: UpdateNode, history: Message[] = []) {
    const messages = [
        { role: "system", content: nodeSystemPrompt },
        ...history,
        { role: "user", content: `I want to learn about: ${prompt}.` }
    ] as Message[];

    return await streamGroqResponse(messages, async (fullResponse) => {
        return updateResponseAsNode(parseStructuredNode(fullResponse), params);
    });
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
  • "followups" may include up to 3 optional replacement questions that reinterprets the query into concrete educational questions.
  • Example: ["Teach me about biological trees", "Explain the trees data structure"]

Formatting for "content":
- Use readable GitHub-Flavored Markdown (headings, short paragraphs, bullet points).
- Use real newlines, never literal "\\n".
- Only use fenced code blocks when you must show actual code or math.
- Avoid wrapping the entire output in backticks.
- Keep total length under 500 words.

Formatting for "followups":
- In "success": 2–5 concise, distinct educational follow-up questions. They should be directly relevant to the content. Things that may have been brought up without proper context or explanation.
- In "clarify": 0–3 optional suggestions for directed questions. These must be questions that would not need additional clarification.

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
    "Teach me about biological growth of trees",
    "Help me understand binary trees in computer science"
  ]
}
`;

// This method creates flashcards for the node passed in and stores them in the database
export async function createFlashcards(data: Node) {
    let flashcards: CreatedFlashcard[] = [];
    try {
        // First we generate the actual content
        const flashcardData = await generateFlashcards({
            nodeName: data.name,
            nodeContent: data.content,
        });

        // Then we store them in the database
        if (flashcardData.length > 0) {
            const createdFlashcards = await prisma.$transaction(
            flashcardData.map((fc: FlashcardInput) =>
                prisma.flashcard.create({
                data: {
                    nodeId: data.id,
                    userId: data.userId,
                    name: fc.keyword,
                    content: fc.definition,
                },
                })
            )
            );

            flashcards = createdFlashcards.map((fc) => ({
            id: fc.id,
            keyword: fc.name,
            definition: fc.content,
            }));
        }
    } catch (e) {
        console.error("Root node flashcard generation error:", e);
    }
}
