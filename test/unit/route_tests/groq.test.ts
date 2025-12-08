// These tests ensure that calls to the groq api are working as expected.
import { POST as GetMessage } from "@/app/api/groq/chat/route";
import { NextRequest } from "next/server";

describe("Testing Groq endpoints", () => {
    test("Succesfully calls Groq chat endpoint", async () => {
        // Make a fake request
        const body = { messages: [{ role: "user", content: "Hello, Groq!" }] }
        const req = new NextRequest('http://fake_url/api/groq/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // Now call the route directly
        const res = await GetMessage(req);
        expect(res.status).toBe(200);
        // Extra checks could be added to validate the response structure
    })
});
