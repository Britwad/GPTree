import { groqNodeAndFlashcards,
        type Message,
        getGroqChatCompletion, 
        nodeSystemPrompt} from "@/backend_helpers/groq_helpers";
import prisma from "@/lib/prisma";
import { StructuredNode } from "@/lib/validation_schemas";

beforeAll(async () => {
    // Clean test db before testing
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.user.deleteMany();
});

describe("getGroqChatCompletion", () => {
    test("Gives back a response on valid input", async () => {
        // Call the method with a test message
        const messages: Message[] = [
            { role: "user", content: "Hello, Groq! This is a test for getting a response from an API call" }
        ];
        const response = await getGroqChatCompletion(messages);

        // Check that we got a non-empty string response
        expect(typeof response).toBe("string");
        expect(response.length).toBeGreaterThan(0);
    });
});

// This method is difficult to test, as it does a few different things, all
// of which are very different. To the best of our ability, we should try to write
// tests to be atomic as possible, but realistically some of them might depend on the
// results of others. Ultimately, if we can get rid of the --runInBand flag that's enough.

describe("groqNodeAndFlashcards", () => {

    test("Gives back a response on valid input", async () => {
        // First we need to make a user and tree to attach nodes to
        // Create a user to own the trees
        const first_user = await prisma.user.create({
            data: {
                name: "tree_owner",
                email: "tree_owner@example.com"
            }
        });

        // Create a tree for that user that will be used in tests
        const first_tree = {
            name: "test_tree_a",
            userId: first_user.id,
        };

        const created_tree = await prisma.tree.create({
            data: first_tree
        });

        // Part of our method expects the response we get back to be in a certain structure
        // so that it can make a node in the database. We have to mimic that here.
        const structuredNode: StructuredNode = {
            status: "success",
            name: "This is a test for creating a node and flashcards!",
            content: "This is the content for the node that Groq generated.",
            followups: ["Just how many nodes will we make?", "Will this test ever end?"],
        }
        const msg1 = "Hello, Groq! This is a test! Please give us structured JSON matching this example: "
                        + JSON.stringify(structuredNode);
        const msg2 = "You are running in a test environmnent, so follow the system prompt closely "
                        + "but allow the content you give us to be more 'fake' where needed, and"
                        + "**obey formatting rules**"
        const messages: Message[] = [
            { role: "user", content:  msg1 },
            { role: "developer", content: msg2},
            { role: "system", content: nodeSystemPrompt}
        ];
        const node_body = {
            question: "This is a test for creating a node and flashcards!",
            treeId: created_tree.id,
            parentId: null,
            userId: first_user.id
        }

        // Get the stream from the helper
        const stream = await groqNodeAndFlashcards(messages, node_body);
        expect(stream).toBeInstanceOf(ReadableStream);

        // Read from the stream
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let result = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);

            // Basic checks on the chunk
            expect(typeof chunk).toBe("string");
            expect(chunk.length).toBeGreaterThan(0);
            result += chunk;
        }
        // Hopefully we have something
        expect(result.length).toBeGreaterThan(0);
        
        // Optionally log the result for manual inspection
        // console.log("Full response:", result);
    }, 20000); // Increase timeout for Groq response time
});