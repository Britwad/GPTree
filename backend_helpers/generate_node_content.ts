import { getGroqResponse, groqRootPrompt, groqTeacherPrompt } from "./groq_helpers";

export const generate_node_content = async (prompt: string) => {
    // Generate content for the root node based on the prompt
    const stream = await getGroqResponse([
        { role: "system", content: groqTeacherPrompt },
        {
            role: "user", content: `Create a very broad overview for a topic tree on: ${prompt}. `
                + groqRootPrompt
        }
    ]);
    let content = "";
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value);
    }
    return content;
}