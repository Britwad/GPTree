"use client";

import { useRouter } from "next/navigation";
import StudyPage from "@/components/StudyPage";
import { useState, useEffect } from "react";
import type { Tree } from "@/lib/App";
import { useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const [trees, setTrees] = useState<Tree[]>([]);
  const { data:session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated" || !session?.user) {
      console.log("No user session, redirecting to /");
      router.push("/");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/trees?userId=${encodeURIComponent(session.user.id)}`);
        const data = await res.json();
        
        if (!cancelled) {
          setTrees(data.trees || []);
        }
      } catch (e) {
        console.error("Failed to fetch trees", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status !== "authenticated") {
    return <div>Redirecting...</div>;
  }

  return (
    <StudyPage
      trees={trees}
      userId={session.user.id}
      onNavigate={(p) => {
        if (p === "dashboard") router.push("/tree");
        else if (p === "landing" || p === "study") router.push("/");
        else router.push("/study");
      }}
      onUpdateFlashcard={(id, updates) => {
        // later: call your API to persist
      }}
    />
  );
}