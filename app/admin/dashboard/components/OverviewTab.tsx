"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Ticket, ChevronRight, X, Loader2 } from "lucide-react";
import axios from "axios";

export default function OverviewTab({ 
    onScanClick, 
    onSeeAllClick 
}: { 
    onScanClick: () => void, 
    onSeeAllClick: () => void 
}) {
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 👇 Uses localhost for testing
        const res = await axios.get("https://mes-backend-47zl.onrender.com/api/scan/stats");
        
        if (res.data.success) {
           setStats(res.data.stats);
           setRecentEntries(res.data.recent);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-neutral-500 text-sm">Loading dashboard...</p>
          </div>
      );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      {/* SECTION 1: Stats Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4 ml-2 text-white">Live Status</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar snap-x">
          
          <div className="snap-center min-w-[260px] h-[180px] bg-neutral-900 rounded-[32px] p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
             <div className="flex justify-between items-start z-10">
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                    <Users size={20} className="text-white" />
                </div>
                <span className="text-xs font-bold bg-green-500 text-black px-2 py-1 rounded-full">Live</span>
             </div>
             <div className="z-10">
                <p className="text-neutral-400 text-sm font-medium">Total Check-ins</p>
                <h3 className="text-4xl font-bold text-white mt-1">{stats.checkedIn}</h3>
             </div>
          </div>

          <div className="snap-center min-w-[180px] h-[180px] bg-neutral-900 rounded-[32px] p-6 flex flex-col justify-between border border-white/10">
             <div className="p-2 bg-white/5 rounded-full w-fit">
                <Ticket size={20} className="text-orange-400" />
             </div>
             <div>
                <h3 className="text-3xl font-bold text-white">{stats.pending}</h3>
                <p className="text-neutral-400 text-sm">Pending</p>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Interactive List */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-white">Recent Entries</h2>
            <button 
                onClick={onSeeAllClick}
                className="text-sm text-blue-400 font-medium hover:text-blue-300 active:scale-95 transition-transform"
            >
                See all
            </button>
        </div>

        <div className="flex flex-col gap-3 pb-24">
            {recentEntries.length > 0 ? (
                recentEntries.map((user, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedTicket(user)}
                        className="bg-neutral-900 rounded-[24px] p-4 flex items-center gap-4 border border-white/5 active:scale-[0.98] transition-transform cursor-pointer hover:bg-neutral-800/50"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-neutral-800 overflow-hidden flex items-center justify-center border border-white/5">
                            <span className="text-lg font-bold text-neutral-400">
                                {user.name ? user.name.charAt(0) : "?"}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-white truncate">{user.name}</h4>
                                {/* 🟢 Shows Registration Number on the right edge */}
                                <span className="text-xs font-mono text-neutral-500 shrink-0 ml-2">
                                    {user.regNumber}
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                                Scanned at {user.time} • {user.gate || "Entry"}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-neutral-500">
                    <p>No scans yet today.</p>
                </div>
            )}
        </div>
      </div>

      {/* TICKET DETAILS MODAL */}
      <AnimatePresence>
        {selectedTicket && (
            <>
                {/* 1. BACKDROP: Increased z-index to 100 */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedTicket(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" 
                />
                
                {/* 2. MODAL CONTENT: Increased z-index to 110 and added 'pb-28' for bottom padding */}
                <motion.div 
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    className="fixed bottom-0 left-0 right-0 bg-[#111] rounded-t-[32px] p-6 pb-28 z-[110] border-t border-white/10 shadow-2xl"
                >
                    <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-6" />                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedTicket.name}</h2>
                            <div className="flex flex-col gap-1 mt-2">
                                {/* 🟢 Registration Number */}
                                <p className="text-neutral-400 font-mono text-sm">
                                    Reg: <span className="text-white">{selectedTicket.regNumber || "N/A"}</span>
                                </p>
                                {/* 🟢 Original Ticket ID underneath */}
                                <p className="text-neutral-600 font-mono text-xs">
                                    Ticket ID: {selectedTicket.id}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedTicket(null)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-8">
                        {/* Status */}
                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400">Status</span>
                            <span className="text-green-400 font-bold uppercase">{selectedTicket.status}</span>
                        </div>
                        {/* Time */}
                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400">Time</span>
                            <span className="text-white font-mono">{selectedTicket.time}</span>
                        </div>
                        {/* Gate / Day */}
                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400">Day / Gate</span>
                            <span className="text-white font-bold">{selectedTicket.gate}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedTicket(null)}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl text-lg hover:bg-neutral-200 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}