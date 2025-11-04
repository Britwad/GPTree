"use client";

import { useRouter } from "next/navigation";
import StudyPage from "@/components/StudyPage";
import { mockTrees, mockFlashcards } from "@/lib/mockData";

export default function Page() {
  const router = useRouter();

  // TODO: Replace with real API calls when backend is ready
  // For now, using mock data for skeleton UI
  const trees = mockTrees;
  const flashcards = mockFlashcards;

  return (
    <StudyPage
      trees={trees}
      flashcards={flashcards}
      onNavigate={(p) => {
        if (p === "dashboard") router.push("/dashboard");
        else if (p === "landing" || p === "study") router.push("/");
        else router.push("/study");
      }}
      onUpdateFlashcard={(id, updates) => {
        // later: call your API to persist
      }}
    />
  );
}
