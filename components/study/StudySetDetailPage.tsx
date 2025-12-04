"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./StudyUIComponents";
import { colors } from "@/lib/colors";

type StudySet = {
  id: number;
  title: string;
  slug: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  flashcards: Array<{
    id: number;
    name: string;
    content: string;
    dueAt: string;
  }>;
};

export default function StudySetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [studyset, setStudyset] = useState<StudySet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params?.slug as string;

  const fetchStudyset = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/studysets/${slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Studyset not found");
        } else {
          setError("Failed to load studyset");
        }
        return;
      }

      const data = await res.json();
      setStudyset(data);
    } catch (e) {
      console.error("Failed to fetch studyset", e);
      setError("Failed to load studyset");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !session?.user) {
      router.push("/");
      return;
    }

    if (!slug) {
      setError("Invalid studyset");
      setIsLoading(false);
      return;
    }

    fetchStudyset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router, slug]);

  if (status === "loading") {
    return (
      <div style={{ backgroundColor: colors.superLightGreen, minHeight: "100vh" }}>
        <div className="container mx-auto px-6 py-12">
          <div>Loading session...</div>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div style={{ backgroundColor: colors.superLightGreen, minHeight: "100vh" }}>
        <div className="container mx-auto px-6 py-12">
          <div>Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.superLightGreen, minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10"
        style={{
          backgroundColor: colors.white,
          borderBottomColor: colors.borderGreen,
          borderBottomWidth: "2px",
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/flashcards")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl" style={{ color: colors.darkGray }}>
              {isLoading ? "Loading..." : studyset?.title || "Studyset"}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {isLoading ? (
          <div className="text-center py-12">
            <p style={{ color: colors.darkGray }}>Loading studyset...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p style={{ color: "#ef4444" }}>{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/flashcards")}
              className="mt-4"
            >
              Back to Studysets
            </Button>
          </div>
        ) : studyset ? (
          <div>
            <div className="mb-6">
              <p className="text-sm" style={{ color: colors.darkGray }}>
                {studyset.flashcards.length} flashcards in this studyset
              </p>
            </div>
            <div className="text-center py-12">
              <p style={{ color: colors.darkGray }}>
                Flashcard viewing functionality will be implemented here.
              </p>
              <p className="text-sm mt-2" style={{ color: colors.darkGray }}>
                This is a placeholder page for Yana&apos;s work.
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

