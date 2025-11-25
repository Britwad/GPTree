"use client";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: colors.superLightGreen }}>
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight text-center" style={{ color: colors.darkGray, fontFamily: 'var(--font-inter)' }}>GPTree</h1>
        <p className="text-xl font-medium mb-8 text-center max-w-md" style={{ color: colors.darkGray, fontFamily: 'var(--font-inter)' }}>
          Learn anything, one branch at a time.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 text-white rounded-lg shadow transition"
          style={{ backgroundColor: colors.green, fontFamily: 'var(--font-inter)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.darkGreen}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.green}
        >
          Continue with Google
      </button>

      <div className="flex gap-4">
      <input 
        value={userEmail} 
        onChange={(e) => setUserEmail(e.target.value)}
        placeholder="Enter your email"
            className="flex-1 rounded-lg px-4 py-2 focus:outline-none"
            style={{ borderWidth: '1px', borderColor: colors.lightGray, backgroundColor: colors.white, color: colors.darkGray, fontFamily: 'var(--font-inter)' }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.green}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.lightGray}
        />
      <button
            onClick={() => signIn("email", { email: userEmail })}
            className="px-4 py-2 text-white rounded-lg shadow transition"
            style={{ backgroundColor: colors.green, fontFamily: 'var(--font-inter)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.darkGreen}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.green}
      >
        Continue
      </button>
    </div>
  </div>
      </div>
  </div>
  );
}