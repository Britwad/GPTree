"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import { Button, Card } from "./StudyUIComponents";
import StudySetModal from "./StudySetModal";
import { colors } from "@/lib/colors";

type StudySet = {
  id: number;
  title: string;
  slug: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    flashcards: number;
  };
};

export default function StudySetsListPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [studysets, setStudysets] = useState<StudySet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudyset, setEditingStudyset] = useState<StudySet | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !session?.user) {
      router.push("/");
      return;
    }

    fetchStudysets();
  }, [status, session, router]);

  const fetchStudysets = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/studysets?userId=${encodeURIComponent(session.user.id)}`);
      if (!res.ok) throw new Error("Failed to fetch studysets");
      
      const data = await res.json();
      setStudysets(data.studysets || []);
    } catch (e) {
      console.error("Failed to fetch studysets", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (title: string) => {
    if (!session?.user?.id) return;

    const res = await fetch("/api/studysets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userId: session.user.id }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create studyset");
    }

    await fetchStudysets();
  };

  const handleEdit = async (title: string) => {
    if (!editingStudyset) return;

    const res = await fetch(`/api/studysets/${editingStudyset.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update studyset");
    }

    setEditingStudyset(null);
    await fetchStudysets();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this studyset? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(slug);
    try {
      const res = await fetch(`/api/studysets/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete studyset");
      }

      await fetchStudysets();
    } catch (e) {
      console.error("Failed to delete studyset", e);
      alert(e instanceof Error ? e.message : "Failed to delete studyset");
    } finally {
      setIsDeleting(null);
    }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/tree")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl" style={{ color: colors.darkGray }}>
                Studysets
              </h1>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Studyset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {isLoading ? (
          <div className="text-center py-12">
            <p style={{ color: colors.darkGray }}>Loading studysets...</p>
          </div>
        ) : studysets.length === 0 ? (
          <Card className="p-12 text-center">
            <h2 className="text-2xl mb-4" style={{ color: colors.darkGray }}>
              No Studysets Yet
            </h2>
            <p className="mb-6" style={{ color: colors.darkGray }}>
              Create your first studyset to start organizing your flashcards.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Studyset
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {studysets.map((studyset) => (
              <Card
                key={studyset.id}
                className="p-6 cursor-pointer transition-colors"
                onClick={() => router.push(`/flashcards/${studyset.slug}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.superLightGreen;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.white;
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkGray }}>
                      {studyset.title}
                    </h3>
                    <p className="text-sm" style={{ color: colors.darkGray }}>
                      {studyset._count?.flashcards || 0} flashcards
                    </p>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingStudyset(studyset);
                        setIsModalOpen(true);
                      }}
                      title="Edit studyset"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(studyset.slug)}
                      disabled={isDeleting === studyset.slug}
                      title="Delete studyset"
                      style={{ color: "#ef4444" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fee2e2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      <StudySetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudyset(null);
        }}
        onSubmit={editingStudyset ? handleEdit : handleCreate}
        initialTitle={editingStudyset?.title || ""}
        mode={editingStudyset ? "edit" : "create"}
      />
    </div>
  );
}

