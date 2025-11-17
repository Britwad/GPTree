// This file contains some old tests that don't really match up with any behavior we want
// Later on we should come back and rexamine whether or not these tests should be deleted or updated
import prisma from "@/lib/prisma";
import { GET as GetUserTrees } from "@/app/api/users/[id]/trees/route";
import { POST as MakeTree } from "@/app/api/trees/route";
import {
  type CreateTree,
  TreeListSchema,
} from "@/lib/validation_schemas";
import { User } from "@/app/generated/prisma";
import { NextRequest } from "next/server";

beforeEach(async () => {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.node.deleteMany();
  await prisma.tree.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.node.deleteMany();
  await prisma.tree.deleteMany();
  await prisma.user.deleteMany();
});

describe("Testing user/tree endpoints", () => {
  test("Succesfully gets trees for a user", async () => {
    const first_user = await prisma.user.create({
      data: {
        name: "tree_owner",
        email: "tree_owner@example.com",
      },
    });

    const first_tree: CreateTree = {
      name: "test_tree_a",
      userId: first_user.id,
      prompt:
        "Root prompt for tree A, this is a test prompt, so let's make this tree about how to tie shoes",
    };

    const second_tree: CreateTree = {
      name: "test_tree_b",
      userId: first_user.id,
      prompt:
        "Root prompt for tree B, this is a test prompt, so let's make this tree about how to bake a cake",
    };

    const req1 = new NextRequest("http://fake_url/api/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(first_tree),
    });
    await MakeTree(req1);

    const req2 = new NextRequest("http://fake_url/api/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(second_tree),
    });
    await MakeTree(req2);

    const req3 = new NextRequest(
      `http://fake_url/api/users/` + first_user.id + "/trees",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const res = await GetUserTrees(req3, {
      params: Promise.resolve({ id: first_user.id }),
    });

    expect(res.status).toEqual(200);
    const returned_trees = TreeListSchema.parse(await res.json());
    expect(returned_trees.length).toEqual(2);
    expect(returned_trees[0]._count.nodes).toEqual(1);
    expect(returned_trees[1]._count.nodes).toEqual(1);
  }, 60000);
});