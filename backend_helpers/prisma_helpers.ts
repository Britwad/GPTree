import prisma from "@/lib/prisma";
import { CreatedFlashcard, FlashcardInput } from "@/lib/validation_schemas";
import { Node } from "@/app/generated/prisma";
import { generateFlashcards } from "@/backend_helpers/groq_helpers";

// This method creates flashcards for the node passed in and stores them in the database
export async function createFlashcards(data: Node) {
    let flashcards: CreatedFlashcard[] = [];
    try {
        // First we generate the actual content
        const flashcardData = await generateFlashcards({
            nodeName: data.name,
            nodeContent: data.content,
        });

        // Then we store them in the database
        if (flashcardData.length > 0) {
            const createdFlashcards = await prisma.$transaction(
            flashcardData.map((fc: FlashcardInput) =>
                prisma.flashcard.create({
                data: {
                    nodeId: data.id,
                    userId: data.userId,
                    name: fc.keyword,
                    content: fc.definition,
                },
                })
            )
            );

            flashcards = createdFlashcards.map((fc) => ({
            id: fc.id,
            keyword: fc.name,
            definition: fc.content,
            }));
        }
    } catch (e) {
        console.error("Root node flashcard generation error:", e);
    }
}