import prisma from "@/lib/prisma";
import { POST as MakeUser } from '@/app/api/users/route';
import { GET as GetUser} from '@/app/api/users/[id]/route';
import { GET as GetUserTrees } from '@/app/api/users/[id]/trees/route';
import { type CreateUser, type User, UserSchema } from '@/lib/validation_schemas';
import { NextRequest } from 'next/server';

beforeAll(async () => {
    // Clean test db before testing
    // (We need to clear all tables not just users,
    //  but we can add more once we test more things)
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up
    await prisma.node.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.user.deleteMany();
});

// We can make a user that will stay in the db for multiple tests
    const first_user: CreateUser = { 
        name: "test_user_a",
        email: "testemail@fakedomain.com"
    };
    let created_user: User | null = null;

describe('Testing user endpoints', () => {
    test('Succesfully creates a new user', async () => {
        // Make a fake user request
        const body: CreateUser = first_user;
        const req = new NextRequest('http://fake_url/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Now call the route directly
        const res = await MakeUser(req);

        // Check response
        expect(res.status).toEqual(201);
        const newUser: User = UserSchema.parse(await res.json());
        expect(newUser.name).toEqual(body.name);
        expect(newUser.email).toEqual(body.email);

        // Save for later tests
        created_user = newUser;
    });

    test('Rejects creation with a bad email', async () => {
        // Make a fake user request
        const body = { 
            name: "test_user_b",
            email: "not_an_email"
        };
        const req = new NextRequest('http://fake_url/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Now call the route directly
        const res = await MakeUser(req);

        // Check response
        expect(res.status).toEqual(400);
    });

    test('Rejects creation with a missing field', async () => {
        // Make a fake user request
        const body1 = { 
            email: "testemail@fakedomain.com"
        };
        const req1 = new NextRequest('http://fake_url/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body1),
        });
        const body2 = { 
            name: "test_user_c"
        };
        const req2 = new NextRequest('http://fake_url/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body2),
        });

        // Now call the route directly
        const res1 = await MakeUser(req1);
        const res2 = await MakeUser(req2);

        // Check response
        expect(res1.status).toEqual(400);
        expect(res2.status).toEqual(400);
    });

    test('Sucessfully gets a user by id', async () => {
        // We can get the user from the first test
        if (created_user === null) {
            throw new Error("Created user is null, previous test must have failed");
        }
        const req = new NextRequest('http://fake_url/api/users/' + created_user.id, {
            method: 'GET',
        });

        // Now call the route directly
        const res = await GetUser(req, { id: created_user.id });

        // Check response
        expect(res.status).toEqual(200);
        const fetched_user: User = UserSchema.parse(await res.json());
        expect(fetched_user.id).toEqual(created_user.id);
        expect(fetched_user.name).toEqual(created_user.name);
        expect(fetched_user.email).toEqual(created_user.email);
    });

    test('Getting a user with a bad id returns null', async () => {
        const req = new NextRequest('http://fake_url/api/users/nonexistentid', {
            method: 'GET',
        });

        // Now call the route directly
        const res = await GetUser(req, { id: 'nonexistentid' } );
        
        // Check response
        expect(res.status).toEqual(200);
        const fetched_user = await res.json();
        expect(fetched_user).toBeNull();
    });

    test('Successfully gets the trees a user has', async () => {
        // We can get the user from the first test
        if (created_user === null) {
            throw new Error("Created user is null, previous test must have failed");
        }
        const req = new NextRequest('http://fake_url/api/users/' + created_user.id + '/trees', {
            method: 'GET',
        });

        // Now call the route directly
        const res = await GetUserTrees(req, { id: created_user.id });

        // Check response
        expect(res.status).toEqual(200);
        const trees = await res.json();
        expect(Array.isArray(trees)).toBe(true);
        // Further checks can be added here based on the tree structure
    });
});