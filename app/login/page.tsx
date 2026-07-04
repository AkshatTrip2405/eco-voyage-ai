"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [isFlying, setIsFlying] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFlying(true);
    setError("");

    try {
      if (mode === "forgot") {
        setTimeout(() => {
          alert("Password reset link sent to your email!");
          setIsFlying(false);
          setMode("login");
        }, 1000);
        return;
      }

      const endpoint = mode === "login" 
        ? "http://127.0.0.1:8000/api/auth/login" 
        : "http://127.0.0.1:8000/api/auth/register";
        
      const payload = mode === "login" 
        ? { email, password } 
        : { name, email, password };

      // 1. Send real request to your FastAPI backend
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // 2. Check if the database rejected the login (e.g., No Account Found)
      if (!response.ok) {
        setError(data.detail || "An error occurred.");
        setIsFlying(false); // Stop the animation
        return; // Stop here, do NOT route to dashboard
      }

      // 3. Success! Delay just for the airplane takeoff animation, then redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
        
    } catch (err) {
      setError("Connection failed. Check if backend is running.");
      setIsFlying(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900 font-sans">
      
      {/* Custom Keyframe Animation for the Airplane */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fly-away {
          0% { transform: translate(0, 0) rotate(45deg) scale(1); opacity: 1; }
          30% { transform: translate(30px, -30px) rotate(45deg) scale(1.2); opacity: 1; }
          100% { transform: translate(200px, -200px) rotate(45deg) scale(0.5); opacity: 0; }
        }
        .animate-plane { animation: fly-away 1.5s forwards ease-in-out; }
      `}} />

      {/* Stunning Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[20s] ease-linear scale-110 hover:scale-100"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
      </div>

      {/* Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden transition-all duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Eco Voyage <span className="text-green-400">AI</span>
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            {mode === "login" && "Welcome back, explorer."}
            {mode === "register" && "Start your sustainable journey."}
            {mode === "forgot" && "Let's get you back on track."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          
          {mode === "register" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all placeholder-gray-500"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="jane@example.com"
            />
          </div>

          {mode !== "forgot" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Password</label>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-green-400 hover:text-green-300 font-medium transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all placeholder-gray-500 tracking-widest"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>}

          <button 
            type="submit" 
            disabled={isFlying}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-extrabold text-slate-900 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] active:scale-95 mt-6 overflow-hidden"
          >
            <span className={`absolute left-0 inset-y-0 flex items-center pl-4 transition-all duration-300 ${isFlying ? 'opacity-100' : 'opacity-0'}`}>
               {/* Plane Icon */}
              <svg className={`h-6 w-6 text-slate-900 ${isFlying ? 'animate-plane' : 'transform rotate-45'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
            {isFlying ? "Boarding Flight..." : (
              mode === "login" ? "Sign In" : 
              mode === "register" ? "Create Account" : "Send Recovery Link"
            )}
          </button>
        </form>

        {/* Footer Toggles */}
        <div className="mt-8 text-center border-t border-white/10 pt-6">
          {mode === "login" ? (
            <p className="text-gray-400 text-sm">
              Ready to explore?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} className="text-white font-bold hover:text-green-400 transition-colors">
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-gray-400 text-sm">
              Already have a ticket?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-white font-bold hover:text-green-400 transition-colors">
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}