import prisma from "@/lib/prisma";
import { POST as MakeUser } from "@/app/api/users/route";
import { GET as GetUser } from "@/app/api/users/[id]/route";
import { GET as GetUserTrees } from "@/app/api/users/[id]/trees/route";
import {
  type CreateUser,
  type User,
  UserSchema,
} from "@/lib/validation_schemas";
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

describe("Testing user endpoints", () => {
  const test_user: CreateUser = {
    name: "test_user_a",
    email: "testemail@fakedomain.com",
  };

  test("Succesfully creates a new user", async () => {
    const body: CreateUser = test_user;
    const req = new NextRequest("http://fake_url/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await MakeUser(req);

    expect(res.status).toEqual(201);
    const newUser: User = UserSchema.parse(await res.json());
    expect(newUser.name).toEqual(body.name);
    expect(newUser.email).toEqual(body.email);
  });

  test("Rejects creation with a bad email", async () => {
    const body = {
      name: "test_user_b",
      email: "not_an_email",
    };
    const req = new NextRequest("http://fake_url/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await MakeUser(req);
    expect(res.status).toEqual(400);
  });

  test("Rejects creation with a missing field", async () => {
    const body1 = {
      email: "testemail@fakedomain.com",
    };
    const req1 = new NextRequest("http://fake_url/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body1),
    });
    const body2 = {
      name: "test_user_c",
    };
    const req2 = new NextRequest("http://fake_url/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body2),
    });

    const res1 = await MakeUser(req1);
    const res2 = await MakeUser(req2);

    expect(res1.status).toEqual(400);
    expect(res2.status).toEqual(400);
  });

  test("Sucessfully gets a user by id", async () => {
    const created_user = await prisma.user.create({ data: test_user });

    const req = new NextRequest("http://fake_url/api/users/" + created_user.id, {
      method: "GET",
    });

    const res = await GetUser(req, {
      params: Promise.resolve({ id: created_user.id }),
    });

    expect(res.status).toEqual(200);
    const fetched_user: User = UserSchema.parse(await res.json());
    expect(fetched_user.id).toEqual(created_user.id);
  });

  test("Getting a user with a bad id returns 404", async () => {
    const req = new NextRequest("http://fake_url/api/users/nonexistentid", {
      method: "GET",
    });

    const res = await GetUser(req, {
      params: Promise.resolve({ id: "nonexistentid" }),
    });

    expect(res.status).toEqual(404);
  });

  test("Successfully gets the trees a user has", async () => {
    const created_user = await prisma.user.create({ data: test_user });

    const req = new NextRequest(
      "http://fake_url/api/users/" + created_user.id + "/trees",
      {
        method: "GET",
      }
    );

    const res = await GetUserTrees(req, {
      params: Promise.resolve({ id: created_user.id }),
    });

    expect(res.status).toEqual(200);
    const trees = await res.json();
    expect(Array.isArray(trees)).toBe(true);
    expect(trees.length).toEqual(0);
  });
});