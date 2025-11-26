"use client";

import { useRouter, useSearchParams } from "next/navigation";
import FlashcardQueue from "./FlashcardQueue";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studyset = searchParams?.get("studyset") ?? undefined;
  const { data: session, status } = useSession();

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") return;

    if (status !== "authenticated" || !session?.user) {
      router.push("/");
      return;
    }

    setUserId(session.user.id);
  }, [status, session, router]);

  if (status === "loading") return <div>Loading session...</div>;
  if (status !== "authenticated") return <div>Redirecting...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Flashcard Queue</h1>
      <p className="text-sm text-gray-600 mb-4">
        Showing queue for{" "}
        <strong>{studyset ? `studyset: ${studyset}` : "default studyset"}</strong>.
      </p>

      {/* Note: FlashcardQueue currently expects only userId */}
      <FlashcardQueue userId={userId!} />
    </div>
  );
}
