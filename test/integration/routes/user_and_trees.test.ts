// For now at least, this file is meant to have tests
// that check behavior that involves user and tree routes.
// For example, making sure that we correctly get the trees
// for a user requires us to make multiple trees with a route
// in the /trees folder, and use a route under the /users folder
// to get them

// This specific file might be better off as a unit test, maybe move later

import prisma from "@/lib/prisma";
import { GET as GetUserTrees } from '@/app/api/users/[id]/trees/route';
import { POST as MakeTree } from '@/app/api/trees/route'; 
import { GetByUserId, type CreateTree, TreeListSchema } from '@/lib/validation_schemas';
import { User } from "@/app/generated/prisma";
import { NextRequest } from 'next/server';

let first_user: User = {} as User;
let first_tree: CreateTree = {} as CreateTree;
let second_tree: CreateTree = {} as CreateTree;
beforeAll(async () => {
    // Clean test db before testing
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
        prompt: "Root prompt for tree A, this is a test prompt, so let's make this tree about how to tie shoes"
    };

    second_tree = {
        name: "test_tree_b",
        userId: first_user.id,
        prompt: "Root prompt for tree B, this is a test prompt, so let's make this tree about how to bake a cake"
    }
});

afterAll(async () => {
        // Clean up
        await prisma.node.deleteMany();
        await prisma.tree.deleteMany();
        await prisma.user.deleteMany();
});

// This test should be restructured to use fetch later, but for now it's fine
describe('Testing user/tree endpoints', () => {
    test('Succesfully gets trees for a user', async () => {
        // Make fake requests
        const body1: CreateTree = first_tree;
        const req1 = new NextRequest('http://fake_url/api/trees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body1),
        });
        
        const body2: CreateTree = second_tree;
        const req2 = new NextRequest('http://fake_url/api/trees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body2),
        });

        const body3: GetByUserId = { id: first_user.id };
        const req3 = new NextRequest(`http://fake_url/api/users/` + first_user.id + '/trees', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        // Now call the routes directly
        // (MakeTree must have already passed unit testing)
        await MakeTree(req1);
        await MakeTree(req2);
        const res = await GetUserTrees(req3, body3);

        // Check response
        expect(res.status).toEqual(200);
        const returned_trees = TreeListSchema.parse(await res.json());
        expect(returned_trees.length).toEqual(2);
        expect(returned_trees[0]._count.nodes).toEqual(1);
        expect(returned_trees[1]._count.nodes).toEqual(1);
    }, 25000); // Adding time for Groq response
});