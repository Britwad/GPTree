import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
export type Message = { role: "system" | "user" | "assistant"; content: string };

// General method to get a response from Groq
export async function getGroqResponse(messages: Message[]) {
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
        model: "compound-beta",
        messages,
        temperature: 0.7,
        stream: true,
    });

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
                }
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

// Some behavioral promts for Groq will go here
export const groqTeacherPrompt = 'You will be a knowledgeable and patient teacher helping a student understand concepts.'
  + ' You will do so by helping students build trees for large topics, which contain nodes with information about subtopics.'
  + ' Each node should have 500 words or less, and add a note if and only if that word count is insufficient to cover the topic.';


export const groqRootResponseStructure = {
    type: 'json_schema',
    json_schema: {
        name: 'root_node_text',
        schema: {
            type: 'object',
            properties: {
                overview: { type: 'string' },
                subtopics: { 
                    type: 'array',
                    items: { type: 'string'}
                }
            }
        },
        required: ['overview', 'subtopics'],
        additional_properties: false,
    }
};

export const groqRootPrompt = 'For the provided topic, Focus on identifying the **main branches (subtopics)** that someone '
  + 'would need to understand to gain a complete, high-level understanding of the subject. Because this is the root node, '
  + 'avoid going into any level of detail on subtopics; instead, provide a 1-2 sentence description of the overall topic, and '
  + 'list the subtopics as bullet points. Ensure that your response is in **strict JSON** format matching the provided JSON structure: '
  + JSON.stringify(groqRootResponseStructure.json_schema.schema) + '.';
