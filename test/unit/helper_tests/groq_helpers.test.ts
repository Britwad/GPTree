import { getGroqResponse, type Message } from "@/backend_helpers/groq_helpers";

describe("getGroqResponse", () => {
    test("Gives back a response on valid input", async () => {
        const messages: Message[] = [
            { role: "user", content: "Hello, Groq! This is a test for getting a response from an API call" }
        ];
        // Get the stream from the helper
        const stream = await getGroqResponse(messages, {question: "This is a test for streaming a response!", 
            userId: "testUserId", treeId: 1, parentId: null});
        expect(stream).toBeInstanceOf(ReadableStream);

        // Read from the stream
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            expect(typeof chunk).toBe("string");
            expect(chunk.length).toBeGreaterThan(0);
            result += chunk;
        }
        expect(result.length).toBeGreaterThan(0);
        console.log("Full response:", result);
        // Optionally log the result for manual inspection
        // console.log("Full response:", result);
    });
});