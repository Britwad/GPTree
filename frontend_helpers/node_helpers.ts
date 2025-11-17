import { CreateNode } from "@/lib/validation_schemas";

export async function generateNode(body: CreateNode) {
    // Get the stream from the backend
    const res = await fetch("/api/nodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    });

    // Check for errors
    if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || "Failed to create node");
    }

    return res;
}