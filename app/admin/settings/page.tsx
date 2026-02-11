"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, Sun, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const isDark = theme === "dark";

  return (
    // 🟢 DYNAMIC THEME: Changes bg and text based on selection
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-neutral-100 text-neutral-900"
    }`}>
      
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 transition-colors duration-300 ${
          isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-neutral-200"
      }`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className={`p-2 -ml-2 rounded-full transition-colors ${
                isDark ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-neutral-200 text-neutral-600 hover:text-black"
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      {/* CONTENT */}
      <main className="pt-24 px-6 pb-12 max-w-2xl mx-auto space-y-8">
        
        {/* 1. PROFILE SECTION (KEPT EXACTLY AS IS) */}
        <section>
          <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 ml-2">Profile</h2>
          <div className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${
              isDark ? "bg-neutral-900/50 border-white/5" : "bg-white border-neutral-200 shadow-sm"
          }`}>
            <div className={`p-6 flex items-center gap-4 ${isDark ? "border-white/5" : "border-neutral-100"}`}>
               <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/20">
                  A
               </div>
               <div>
                  <h3 className={`text-lg font-bold transition-colors ${isDark ? "text-white" : "text-neutral-900"}`}>
                      Admin User
                  </h3>
                  <p className="text-neutral-400 text-sm">mes.admin@example.com</p>
               </div>
               <button className={`ml-auto px-4 py-2 rounded-full text-xs font-bold transition ${
                   isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
               }`}>
                  Edit
               </button>
            </div>
          </div>
        </section>

        {/* 2. APPEARANCE SECTION (NEW - REPLACES OTHER SETTINGS) */}
        <section>
          <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 ml-2">Appearance</h2>
          
          <div className={`rounded-3xl border overflow-hidden p-2 flex gap-2 transition-colors duration-300 ${
              isDark ? "bg-neutral-900/50 border-white/5" : "bg-white border-neutral-200 shadow-sm"
          }`}>
            
            {/* Dark Option */}
            <button 
                onClick={() => setTheme("dark")}
                className={`flex-1 p-4 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                    isDark 
                        ? "bg-neutral-800 ring-1 ring-white/10 shadow-lg" 
                        : "hover:bg-neutral-100 text-neutral-500"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isDark ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-500"}`}>
                        <Moon size={18} />
                    </div>
                    <span className="font-bold text-sm">Dark Mode</span>
                </div>
                {isDark && <Check size={18} className="text-blue-500" />}
            </button>

            {/* Light Option */}
            <button 
                onClick={() => setTheme("light")}
                className={`flex-1 p-4 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                    !isDark 
                        ? "bg-neutral-50 ring-1 ring-black/5 shadow-lg text-black" 
                        : "hover:bg-white/5 text-neutral-500"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${!isDark ? "bg-orange-500 text-white" : "bg-neutral-800 text-neutral-500"}`}>
                        <Sun size={18} />
                    </div>
                    <span className="font-bold text-sm">Light Mode</span>
                </div>
                {!isDark && <Check size={18} className="text-orange-500" />}
            </button>

          </div>
        </section>

        <p className="text-center text-neutral-500 text-xs mt-12 opacity-50">
           MES Admin Portal v1.0.4 • Built by Aman
        </p>

      </main>
    </div>
  );
}