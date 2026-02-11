"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Auto-redirect if they still have a valid session
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin/dashboard");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Logo/Icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/5 ring-1 ring-white/10">
          <ShieldCheck size={48} className="text-blue-500" />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            MES 2026
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            Official Admin & Security Portal. Manage entries, scan tickets, and view analytics.
          </p>
        </div>

        {/* Main Action Button */}
        <div className="w-full space-y-4 pt-4">
          <Link 
            href="/admin/login" 
            className="group relative w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl text-lg shadow-[0_0_25px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            <span>Access Portal</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-xs text-neutral-600">
            Authorized personnel only.
          </p>
        </div>

      </div>

      {/* Footer / Version */}
      <div className="absolute bottom-6 text-[10px] text-neutral-700 font-mono">
        v1.0.4 • SECURE CONNECTION
      </div>
    </main>
  );
}