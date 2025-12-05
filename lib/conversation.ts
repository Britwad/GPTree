import prisma from "@/lib/prisma";
import { Message } from "@/backend_helpers/groq_helpers";

export async function getConversationHistory(parentId: number): Promise<Message[]> {
    const history: Message[] = [];
    let currentId: number | null = parentId;

    while (currentId !== null) {
        const fetchedNode: { parentId: number | null; question: string; content: string; } | null = await prisma.node.findUnique({
            where: { id: currentId },
            select: { id: true, parentId: true, question: true, content: true }
        });

        if (!fetchedNode) break;

        // Prepend to history (since we are going backwards)
        history.unshift({ role: "assistant", content: fetchedNode.content });
        history.unshift({ role: "user", content: fetchedNode.question });

        currentId = fetchedNode.parentId;
    }

    return history;
}
