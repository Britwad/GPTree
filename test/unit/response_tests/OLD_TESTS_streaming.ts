// This was a test file made during the implementation of 
// streaming our responses from Groq so that we could examine
// the structure of the chunks after parsing, and it was hastily
// put together for that purpose. It's probably smart to come back to
// this file later and make it useful for something





import { JSONParser } from "@streamparser/json-whatwg";
import { POST } from "@/app/api/nodes/route";
import prisma from "@/lib/prisma";
import { User } from "@/app/generated/prisma/wasm";
import { CreateTree, TreeSchema } from "@/lib/validation_schemas";
import { NextRequest } from "next/server";
import { POST as MakeTree } from '@/app/api/trees/route';

let first_user: User = {} as User;
let first_tree: CreateTree = {} as CreateTree;
beforeAll(async () => {
    // Clean test db before testing
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.user.deleteMany();

    // Create a user to own the trees
    first_user = await prisma.user.create({
        data: {
            name: "tree_owner",
            email: "tree_owner@example.com"
        }
    });

    // Create a tree for that user that will be used in tests
    first_tree = {
        name: "This is a test tree for streaming node generation, so make it about streaming.",
        userId: first_user.id,
        prompt: "This is a test prompt for creating a tree, so make this tree about how to grow trees."
    };
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

describe("groqNodeAndFlashcards", () => {
    test("Gives back a response on valid input", async () => {
        const body: CreateTree = first_tree;
        const req = new NextRequest('http://fake_url/api/trees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const res = await MakeTree(req);
        const res_json = await res.json();
        const tree_id = TreeSchema.parse(res_json).id;

        // Get the stream from the helper
        const req_body = {question: "This is a test on how our code handles streaming, so generate a node about anything", 
            userId: first_user.id, treeId: tree_id, parentId: null}
            
        const stream_req = new NextRequest('http://fake_url/api/nodes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req_body),
        });

        const stream = await POST(stream_req);
        //expect(stream).toBeInstanceOf(ReadableStream);

        // Read from the stream
        const parser = new JSONParser();
        const reader = stream.body?.pipeThrough(parser).getReader();
        if (!reader) throw new Error("Reader is undefined");
        let result = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log("Chunk received:", value);
            result += value.value;
        }
        expect(result.length).toBeGreaterThan(0);
        // Optionally log the result for manual inspection
        // console.log("Full response:", result);
    }, 20000);
});