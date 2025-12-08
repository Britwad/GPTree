import prisma from "@/lib/prisma";
import { POST as MakeSet } from '@/app/api/studysets/route';
import { GET as GetTree } from '@/app/api/trees/[treeHash]/route';
import { type CreateTree, TreeSchema, CreateNode, StudySetSchema } from '@/lib/validation_schemas';
import { NextRequest } from 'next/server';
import { User } from "@prisma/client";
import { modelNodeAndFlashcards, nodeSystemPrompt } from "@/backend_helpers/groq_helpers";

let first_user: User = {} as User;
let first_tree: CreateTree = {} as CreateTree;
beforeAll(async () => {
    // Clean test db before testing
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.flashcard.deleteMany();
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.studySet.deleteMany();
    await prisma.user.deleteMany();

    // Create a user to own the study sets
    first_user = await prisma.user.create({
        data: {
            name: "study_set_owner",
            email: "study_set_owner@example.com"
        }
    });

    // Create a tree for that user that will be used in tests
    first_tree = {
        name: "test_tree_a",
        userId: first_user.id,
    };
});

afterAll(async () => {
        // Clean up
        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        await prisma.flashcard.deleteMany();
        await prisma.node.deleteMany();
        await prisma.tree.deleteMany();
        await prisma.studySet.deleteMany();
        await prisma.user.deleteMany();
});

describe('Testing studyset endpoints', () => {
    let first_tree_hash: string = '';

    test('Succesfully creates a new studyset', async () => {
        // Make a fake tree 
        const created_tree = await prisma.tree.create({
            data: first_tree
        });

        // Then some node info
        const nodeInfo: CreateNode = {
            question: "How to write unit tests?",
            treeId: created_tree.id,
            parentId: null,
            userId: first_user.id,
        };

        // Now make a call to the llm
        const stream = await modelNodeAndFlashcards(
            [
                { role: "system", content: nodeSystemPrompt },
                { role: "user", content: `This is a test for our code, make a node about how to write unit tests`}
            ], 
            nodeInfo
        );

        // We just need to consume the stream to make sure it completes
        const reader = stream.getReader();
        let done = false;
        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
        }

        // Now we'll get the info we need to make a studyset
        // First we need the node flashcard ids
        // And before that we need the node itself
        const node = await prisma.node.findFirst({
            where: {
                treeId: created_tree.id,
                question: nodeInfo.question
            }
        });
        if (!node) {
            throw new Error("Node was not created");
        }
        // Node found! Now get flashcards
        const nodeWithFlashcards = await prisma.node.findUnique({
            where: { id: node.id },
            include: { flashcards: true },
        });
        if (!nodeWithFlashcards) {
            throw new Error("Node with flashcards not found");
        }
        // Now we can get flashcard IDs
        const flashcardIds = nodeWithFlashcards.flashcards.map(fc => fc.id);
        const reqBody = {
            title: first_tree.name,
            userId: first_tree.userId,
            flashcardIds: flashcardIds
        };

        // At last we make the studyset request
        const req = new NextRequest('http://fake_url/api/studysets', {
            method: 'POST',
            body: JSON.stringify(reqBody),
        });
        const res = await MakeSet(req);

        // Check response
        expect(res.status).toEqual(201);
        const created_studyset = StudySetSchema.parse(await res.json());
        expect(created_studyset.title).toEqual(first_tree.name);

    }, 20000); // Adding time for Groq response`
});