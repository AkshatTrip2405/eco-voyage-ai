"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlannerPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const generateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/ai/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Secure route!
        },
        body: JSON.stringify({ destination, days }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate itinerary");
      }

      setResult(data.itinerary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4 font-sans text-white">
      
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Eco<span className="text-green-400">Voyage</span> AI</h1>
        <button onClick={() => router.push("/dashboard")} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-2">Build your sustainable journey 🌱</h2>
        <p className="text-gray-400 text-sm mb-8">Tell our AI where you want to go, and we'll craft a zero-waste, eco-friendly itinerary for you.</p>

        <form onSubmit={generateItinerary} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Destination</label>
              <input 
                type="text" 
                required 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full mt-1 bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                placeholder="e.g. Bali, Indonesia"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Days</label>
              <input 
                type="number" 
                min="1" max="14"
                required 
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full mt-1 bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Consulting AI..." : "Generate AI Itinerary ✨"}
          </button>
        </form>

        {/* Error Toast */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-center gap-3">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Loading State Animation */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-4 border-green-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-4 border-emerald-300 animate-spin direction-reverse"></div>
            </div>
            <p className="text-green-400 font-medium animate-pulse text-sm">Calculating carbon footprint & curating stays...</p>
          </div>
        )}

        {/* Final AI Output Display */}
        {result && !isLoading && (
          <div className="mt-10 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <span className="text-2xl">🌍</span>
              <h3 className="text-xl font-extrabold text-white">Your AI Eco-Itinerary</h3>
            </div>
            <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}