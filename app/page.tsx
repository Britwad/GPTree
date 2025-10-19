"use client";
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from 'react';

export default function LandingPage() {
  const { data: session } = useSession()
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string>("");

  const handleClick = () => {
    router.push('/tree');
  }

  return (
    session ? (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center -mt-16">
        <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
          GPTREE
        </h1>
        <button onClick={handleClick}>
          New Tree
        </button>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Sign Out
        </button>
      </div >
    ) : (<>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Continue with Google
      </button>
      <input value={userEmail} onChange={(e) => setUserEmail(e.target.value)}/>
      <button
        onClick={() => signIn("email", { email: userEmail})}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Continue with Email
      </button>
    </>
    )
  );
}