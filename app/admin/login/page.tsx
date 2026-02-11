"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real backend call later
    if (username === "admin" && password === "mes2026") {
      // Set a cookie or local storage token here
      localStorage.setItem("adminToken", "valid");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        {/* Logo / Icon */}
        <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          <ShieldCheck size={40} className="text-blue-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">Admin Portal</h1>
        <p className="text-neutral-500 mb-8 text-sm">Enter your secure credentials</p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Admin ID</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-blue-500 focus:bg-neutral-800 transition-all text-white"
                placeholder="username"
              />
              <ShieldCheck size={18} className="absolute left-4 top-4.5 text-neutral-600" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Passkey</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-blue-500 focus:bg-neutral-800 transition-all text-white"
                placeholder="••••••••"
              />
              <Lock size={18} className="absolute left-4 top-4.5 text-neutral-600" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            Access Dashboard <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}