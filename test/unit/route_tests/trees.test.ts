import prisma from "@/lib/prisma";
import { POST as MakeTree } from '@/app/api/trees/route';
import { GET as GetTree } from '@/app/api/trees/[treeHash]/route';
import { type CreateTree, TreeSchema } from '@/lib/validation_schemas';
import { NextRequest } from 'next/server';
import { User } from "@/app/generated/prisma";

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
        await prisma.user.deleteMany();
});

describe('Testing tree endpoints', () => {
    let first_tree_hash: string = '';

    test('Succesfully creates a new tree', async () => {
        // Make a fake tree request
        const body: CreateTree = first_tree;
        const req = new NextRequest('http://fake_url/api/trees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Now call the route directly
        const res = await MakeTree(req);

        // Check response
        expect(res.status).toEqual(201);
        const parsed = await res.json();
        const created_tree = TreeSchema.parse(parsed);
        expect(created_tree.name).toEqual(body.name);
        expect(created_tree.userId).toEqual(body.userId);

        // Save hash for later
        first_tree_hash = created_tree.hash;
    }, 20000); // Adding time for Groq response

    test('Successfully gets an existing tree', async () => {
        // Make a fake tree request
        const req = new NextRequest('http://fake_url/api/trees/' + first_tree_hash, {
            method: 'GET',
        });

        // Now call the route directly
        const res = await GetTree(req, { params: Promise.resolve({ treeHash: first_tree_hash }) });

        // Check response
        expect(res.status).toEqual(200);
        const fetched_tree = TreeSchema.parse(await res.json());
        expect(fetched_tree.name).toEqual(first_tree.name);
        expect(fetched_tree.userId).toEqual(first_tree.userId);
    });
});