import prisma from "@/lib/prisma";
import { type CreateTree } from '@/lib/validation_schemas';
//import { NextRequest } from 'next/server';
import { User } from "@/app/generated/prisma";

let first_user: User = {} as User;
let first_tree: CreateTree = {} as CreateTree;
beforeAll(async () => {
    // Clean test db before testing
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
        prompt: "Root prompt for tree A"
    };
});

afterAll(async () => {
        // Clean up
        await prisma.flashcard.deleteMany();
        await prisma.node.deleteMany();
        await prisma.tree.deleteMany();
        await prisma.user.deleteMany();
});

describe('Testing node endpoints', () => {
    test('Succesfully creates a new node (placeholder test)', async () => {
        // Placeholder test until we implement node creation
        expect(true).toBe(true);
    });


    test('Succesfully gets nodes for a tree', async () => {
        // Placeholder test until we implement node retrieval
        expect(first_tree.name).toBe("test_tree_a");
    });
}); 