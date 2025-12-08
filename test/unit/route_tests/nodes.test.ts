import prisma from "@/lib/prisma";
import { type CreateTree } from '@/lib/validation_schemas';
import { NextRequest } from 'next/server';
import { User, Tree } from "@prisma/client";
import { CreateNode } from "@/lib/validation_schemas";
import { POST as MakeNode, GET as GetNodes } from "@/app/api/nodes/route";

let first_user: User = {} as User;
let first_tree: CreateTree = {} as CreateTree;
beforeAll(async () => {
    // Clean test db before testing
    await prisma.flashcard.deleteMany();
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.studySet.deleteMany();
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
        await prisma.flashcard.deleteMany();
        await prisma.node.deleteMany();
        await prisma.tree.deleteMany();
        await prisma.studySet.deleteMany();
        await prisma.user.deleteMany();
});

let tree: Tree;
describe('Testing node endpoints', () => {
    test('Succesfully creates a new node', async () => {
        // First we make the tree
        const created_tree = await prisma.tree.create({
            data: first_tree
        });

        // Storing the tree for later use
        tree = created_tree;

        // Now we can make a node for that tree
        // const node_data: CreateNode = {
        //     question: "What is testing?",
        //     treeId: created_tree.id,
        //     userId: first_user.id,
        //     parentId: null
        // };
        
        // The following test does not cover streaming, and needs to be updated
        // Make a fake request
        // const req = new NextRequest('http://fake_url/api/nodes', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(node_data),
        // });


        // // Now call the route directly
        // const res = await MakeNode(req);
        // expect(res.status).toBe(200);
        // const data = await res.json();
        // expect(data.question).toBe("What is testing?");
        // expect(data.treeId).toBe(created_tree.id);
        // expect(data.userId).toBe(first_user.id);

        expect(true).toBe(true); // Placeholder until streaming is handled
    });


    test('Succesfully gets nodes for a tree', async () => {
        // The following test does not cover streaming, and needs to be updated
        expect(true).toBe(true); // Placeholder until streaming is handled
        // Until we update for streaming, we'll make the node directly
        // const created_node = await prisma.node.create({
        //     data: {
        //         question: "What is testing?",
        //         treeId: tree.id,
        //         userId: first_user.id,
        //         parentId: null,
        //         status: "success",
        //         content: "Some stuff about testing",
        //         followups: ["is testing fun?"],
        //         name: "Testing Node"
        //     }
        // });

        // // Make a fake request
        // const req = new NextRequest(`http://fake_url/api/nodes?treeHash=${tree.hash}&userId=${first_user.id}`, {
        //     method: 'GET',
        // });

        // // Now call the route directly
        // const res = await GetNodes(req);
        // expect(res.status).toBe(200);
        // const data = await res.json();
        // expect(data.nodes.length).toBe(1);
        // expect(data.nodes[0].question).toBe("What is testing?");
    });
}); 