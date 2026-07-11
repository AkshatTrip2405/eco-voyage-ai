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

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.error || "An error occurred.");
        setIsFlying(false);
        return; 
      }

      // ---> THE CRITICAL MISSING PIECE <---
      // We MUST save the ticket, otherwise the dashboard will kick us out!
      if (mode === "login" && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      // Success! Delay just for the airplane takeoff animation, then redirect
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
      <style>{`
        @keyframes fly-away {
          0% { transform: translate(0, 0) rotate(45deg) scale(1); opacity: 1; }
          30% { transform: translate(30px, -30px) rotate(45deg) scale(1.2); opacity: 1; }
          100% { transform: translate(200px, -200px) rotate(45deg) scale(0.5); opacity: 0; }
        }
        .animate-plane { animation: fly-away 1.5s forwards ease-in-out; }
      `}</style>

      {/* Stunning Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[20s] ease-linear scale-110 hover:scale-100"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
      </div>

      {/* Glassmorphism Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden transition-all duration-500">
        
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

        {/* --- NEW: OAUTH SECTION --- */}
        {mode === "login" && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.location.href = "/api/auth/signin"}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/20 rounded-xl shadow-sm bg-white/5 hover:bg-white/10 text-sm font-bold text-white transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Sign in with GitHub
              </button>
            </div>
          </div>
        )}

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