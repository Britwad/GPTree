"use client";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/tree");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <h1 className="text-5xl font-bold mb-4 text-gray-800 tracking-tight">GPTree</h1>
      <p className="text-xl font-medium text-gray-600 mb-8 text-center max-w-md">
        Learn anything, one branch at a time.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <p className="text-center text-gray-500 mb-2">Sign in to get started</p>
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Continue with Google
        </button>

        <div className="flex gap-4">
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 focus:ring-1 focus:ring-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <button
            onClick={() => signIn("email", { email: userEmail })}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}