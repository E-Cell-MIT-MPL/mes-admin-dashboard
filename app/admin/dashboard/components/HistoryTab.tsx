"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, RefreshCw, Check, X } from "lucide-react";
import axios from "axios";

export default function HistoryTab() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pop-up Modal State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // 1. Fetch Real Data
  const fetchHistory = async () => {
    try {
      setLoading(true);
      // 👇 Switched to localhost for testing
      const res = await axios.get("https://mes-backend-47zl.onrender.com/api/scan/history");
      if (res.data.success) {
        
        // 🟢 Data Transformation: Map regNumber and fix display days
        const formattedData = res.data.data.map((item: any) => {
            let displayDay = item.gate;
            if (displayDay) {
                if (displayDay.includes("10/2") || displayDay.includes("10 Feb")) displayDay = "Day 1";
                else if (displayDay.includes("11/2") || displayDay.includes("11 Feb")) displayDay = "Day 2";
                else if (displayDay.includes("12/2") || displayDay.includes("12 Feb")) displayDay = "Day 3";
            }

            return {
                ...item,
                ticketId: item.id || item.ticketId, // Fallback for ticket ID
                regNumber: item.regNumber || "N/A", // 🟢 Map the Registration Number
                role: item.role || "Unknown",
                day: displayDay || "Unknown Day"
            };
        });

        setHistoryData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. Toggle Logic
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  // 3. Filtering Logic
  const filteredHistory = historyData.filter((item) => {
    // 🟢 Update search to look for regNumber as well
    const matchesSearch = 
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.regNumber || "").includes(searchTerm) || 
        (item.ticketId || "").includes(searchTerm);

    if (selectedDay !== "ALL" && item.day !== selectedDay) return false;

    if (activeFilters.includes("MAHE") && !item.role?.includes("MAHE STUDENT")) return false;
    if (activeFilters.includes("NON-MAHE") && item.role !== "NON-MAHE") return false;
    return matchesSearch;
  });

  return (
    <div className="min-h-full flex flex-col relative">
        
        {/* --- LOCKED SEARCH BAR & DAY SELECTOR --- */}
        <div className="sticky top-24 z-40 bg-black pt-4 pb-4 px-6 border-b border-white/10 shadow-xl w-full">
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   Scan History 
                   <button onClick={fetchHistory} className="text-neutral-600 hover:text-white transition"><RefreshCw size={14} /></button>
                </h2>
                
                <div className="flex bg-neutral-900 rounded-lg p-1 border border-white/5">
                    {['ALL', 'Day 1', 'Day 2', 'Day 3'].map((day) => (
                        <button
                           key={day}
                           onClick={() => setSelectedDay(day)}
                           className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                              selectedDay === day ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'
                           }`}
                        >
                           {day === 'ALL' ? 'ALL' : day.replace(' ', '')}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="relative">
                {/* 🟢 Updated placeholder to mention Registration Number */}
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, Reg No, or ID..." 
                    className="w-full bg-neutral-900 border border-white/10 h-12 pl-10 pr-12 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-neutral-600"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                        isFilterOpen || activeFilters.length > 0
                            ? "bg-white text-black border-white" 
                            : "bg-neutral-800 text-neutral-400 border-white/5 hover:bg-neutral-700"
                    }`}
                >
                    <Filter size={16} />
                </button>

                <AnimatePresence>
                    {isFilterOpen && (
                        <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setIsFilterOpen(false)} />
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-14 w-60 bg-[#151515] border border-white/10 rounded-xl shadow-2xl p-2 z-[70]"
                            >
                                <p className="text-[10px] font-bold text-neutral-500 uppercase px-3 py-2">Filter By Type</p>
                                <FilterOption label="MAHE Student" isSelected={activeFilters.includes("MAHE")} onClick={() => toggleFilter("MAHE")} />
                                <FilterOption label="Non-MAHE" isSelected={activeFilters.includes("NON-MAHE")} onClick={() => toggleFilter("NON-MAHE")} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* RESULTS LIST */}
        <div className="space-y-3 pt-4 pb-32 px-6">
            {loading ? (
                <div className="text-center py-10 text-neutral-500 text-sm animate-pulse">Loading records...</div>
            ) : (
                <AnimatePresence mode="popLayout">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((item, i) => (
                            <motion.div 
                                key={item.id + item.time + i}
                                layout
                                onClick={() => setSelectedTicket(item)} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-neutral-900/40 rounded-2xl p-4 border border-white/5 flex gap-4 items-center group hover:bg-neutral-900/80 transition-all cursor-pointer active:scale-[0.98]"
                            >
                                 <div className="w-1.5 h-10 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                 
                                 <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-neutral-200">{item.name}</h3>
                                        {/* 🟢 Displays Registration Number instead of Ticket ID */}
                                        <span className="text-xs font-mono text-neutral-500">{item.regNumber}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Badge text={item.day} color="text-white" bg="bg-neutral-800" border="border-white/10" />
                                        <Badge text={item.time} color="text-neutral-400" bg="bg-transparent" border="border-transparent" />
                                        <span className="text-[10px] text-neutral-600 px-1">•</span>
                                        <span className="text-[10px] font-bold text-neutral-500">{item.role}</span>
                                    </div>
                                 </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-12 text-center text-neutral-500">
                            <p>No scans found.</p>
                        </div>
                    )}
                </AnimatePresence>
            )}
        </div>

        {/* 🟢 TICKET DETAILS MODAL (Pop-up) */}
        <AnimatePresence>
        {selectedTicket && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedTicket(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                />
                
                <motion.div 
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-[#111] rounded-t-[32px] p-6 z-[110] border-t border-white/10 shadow-2xl"
                >
                    <div className="w-12 h-1.5 bg-neutral-700 rounded-full mx-auto mb-6" />
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{selectedTicket.name}</h2>
                            {/* 🟢 Registration Number & Sub ID */}
                            <div className="flex flex-col gap-1 mt-2">
                                <p className="text-neutral-400 font-mono text-sm">
                                    Reg: <span className="text-white">{selectedTicket.regNumber || "N/A"}</span>
                                </p>
                                <p className="text-neutral-600 font-mono text-xs">
                                    Ticket ID: {selectedTicket.ticketId || selectedTicket.id || "N/A"}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedTicket(null)} 
                            className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition h-fit"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400 font-medium">Status</span>
                            <span className="text-green-500 font-bold uppercase tracking-wide text-sm bg-green-500/10 px-3 py-1 rounded-lg">
                                ENTRY ALLOWED
                            </span>
                        </div>

                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400 font-medium">Type</span>
                            <span className="text-white font-bold text-sm uppercase">{selectedTicket.role}</span>
                        </div>

                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400 font-medium">Time</span>
                            <span className="text-white font-mono text-lg">{selectedTicket.time}</span>
                        </div>

                        <div className="p-4 bg-black rounded-2xl border border-white/10 flex justify-between items-center">
                            <span className="text-neutral-400 font-medium">Day / Gate</span>
                            <span className="text-white font-bold text-lg">{selectedTicket.day}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedTicket(null)}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl text-lg hover:bg-neutral-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4"
                    >
                        Close
                    </button>
                </motion.div>
            </>
        )}
      </AnimatePresence>

    </div>
  );
}

function FilterOption({ label, isSelected, onClick, icon: Icon, color }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isSelected ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}>
            <div className="flex items-center gap-2">{Icon && <Icon size={14} className={isSelected ? color : "text-neutral-500"} />}<span>{label}</span></div>
            {isSelected && <Check size={14} className="text-blue-500" />}
        </button>
    );
}

function Badge({ text, color, bg, border }: any) {
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${color} ${bg} ${border}`}>{text}</span>;
}