"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("access_token");
    if (!token) {
      // If no ticket, send them back to login!
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-green-400 text-xl animate-pulse font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(52,211,153,0.4)]">
          👤
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">My Profile</h1>
        <p className="text-gray-400 text-sm mb-8">This is your second protected route.</p>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-xl font-bold transition-all mb-4"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            router.push("/login");
          }}
          className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-white py-3 rounded-xl font-bold transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}