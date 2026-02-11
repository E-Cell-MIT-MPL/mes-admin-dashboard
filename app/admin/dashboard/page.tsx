"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, ScanLine, Clock, User, LogOut, Settings } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import ScannerTab from "./components/ScannerTab";
import HistoryTab from "./components/HistoryTab";
import GlassSurface from "./components/GlassSurface";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"home" | "scan" | "history">("home");
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-black text-white font-sans overflow-hidden">
      
      {/* HEADER: Fixed Height h-24 (96px) */}
      {activeTab !== 'scan' && (
        <header className="fixed top-0 left-0 right-0 z-50 h-24 px-6 bg-black border-b border-white/10 flex flex-col justify-end pb-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-0.5">Welcome back</p>
              <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            </div>
            
            <button 
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <User size={20} />
            </button>
          </div>
        </header>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full h-full relative overflow-y-auto no-scrollbar bg-black">
        <AnimatePresence mode="wait">
          
          {activeTab === "home" && (
            <div className="pt-28 pb-36 px-6">
              <OverviewTab 
                  onScanClick={() => setActiveTab("scan")} 
                  onSeeAllClick={() => setActiveTab("history")}
              />
            </div>
          )}
          
          {activeTab === "scan" && (
             <div className="absolute inset-0 z-[60] bg-black">
                <ScannerTab onClose={() => setActiveTab("home")} />
             </div>
          )}

          {activeTab === "history" && (
            <div className="pt-24 pb-36 min-h-full"> 
              <HistoryTab />
            </div>
          )}
          
        </AnimatePresence>
      </main>

      {/* FLOATING GLASS DOCK */}
      <nav className="fixed bottom-8 left-1/2 z-[70] -translate-x-1/2">
        <GlassSurface
          borderRadius={50}
          borderWidth={0.2}
          backgroundOpacity={0.15}
          blur={20}
          className="px-6 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
        >
          <div className="flex items-center gap-8">
            <NavButton 
              active={activeTab === "home"} 
              onClick={() => setActiveTab("home")} 
              icon={LayoutGrid} 
            />
            
            <button 
              onClick={() => setActiveTab("scan")}
              className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
                activeTab === 'scan' 
                  ? 'bg-white text-black scale-110 shadow-white/20' 
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-white/5'
              }`}
            >
              <ScanLine size={28} strokeWidth={activeTab === 'scan' ? 2.5 : 2} />
            </button>

            <NavButton 
              active={activeTab === "history"} 
              onClick={() => setActiveTab("history")} 
              icon={Clock} 
            />
          </div>
        </GlassSurface>
      </nav>

      {/* PROFILE MODAL (RESTORED) */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-neutral-900 rounded-t-[30px] p-6 z-[90] border-t border-white/10 shadow-2xl"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-8" />
              
              {/* User Info Section */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-900/20">
                  A
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Admin User</h3>
                  <p className="text-neutral-400 text-sm">mes.admin@example.com</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
              <button 
   onClick={() => router.push('/admin/settings')} // <--- This makes it navigate
   className="w-full py-4 rounded-xl bg-neutral-800 text-white font-medium flex items-center justify-center gap-3 hover:bg-neutral-700 transition border border-white/5"
>
   <Settings size={20} />
   Account Settings
</button>
                 <button 
                    onClick={handleLogout}
                    className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-3 hover:bg-red-500/20 transition border border-red-500/20"
                 >
                    <LogOut size={20} />
                    Log Out
                 </button>
              </div>
              
              <button 
                onClick={() => setShowProfile(false)}
                className="mt-6 w-full py-4 text-neutral-500 font-medium hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
        active ? "text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-neutral-500 hover:text-neutral-300"
      }`}
    >
      <Icon size={26} strokeWidth={active ? 2.5 : 2} />
      {active && <div className="w-1 h-1 bg-blue-400 rounded-full absolute -bottom-2" />}
    </button>
  );
}