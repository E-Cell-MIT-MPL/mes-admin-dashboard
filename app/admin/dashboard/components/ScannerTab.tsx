"use client";

import React, { useState, useEffect } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { X, CheckCircle, ScanLine, Camera, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function ScannerTab({ onClose }: { onClose: () => void }) {
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Display today's date for the user's reference
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    // Show current date in Indian format to match backend expectations visually
    setTodayDate(new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }));
  }, []);

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    const rawValue = detectedCodes[0]?.rawValue;
    
    // Prevent double scanning
    if (rawValue && !loading && !scanResult && !error) {
      setLoading(true);
      setIsScanning(false); // Pause camera
      
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);

      try {
        // 👇 Uses localhost for testing
        const response = await axios.post("https://mes-backend-47zl.onrender.com/api/scan/ticket", {
            encryptedQR: rawValue
        });

        if (response.data.success) {
            setScanResult(response.data);
        }

      } catch (err: any) {
        console.error("Scan Error:", err);
        setError(err.response?.data?.message || "Invalid or Fake Ticket");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setError(null);
    setIsScanning(true);
  };

  // Helper to determine "Day 1", "Day 2", etc., if backend sends a raw date
  const getDisplayDay = (dateStr: string) => {
    if (!dateStr) return "Unknown Date";
    if (dateStr.includes("10/2") || dateStr.includes("10 Feb")) return "Day 1";
    if (dateStr.includes("11/2") || dateStr.includes("11 Feb")) return "Day 2";
    if (dateStr.includes("12/2") || dateStr.includes("12 Feb")) return "Day 3";
    return dateStr;
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-[100dvh] flex flex-col bg-black overflow-hidden touch-none">
      
      {/* 🟢 HEADER */}
      <div className="absolute top-0 left-0 right-0 p-6 z-[60] flex justify-end pt-12 pointer-events-none">
          <button 
            onClick={onClose}
            className="pointer-events-auto p-3 bg-neutral-900/50 backdrop-blur-md rounded-full text-white border border-white/10 active:scale-95 transition-transform"
          >
            <X size={20} />
          </button>
      </div>

      {/* 1. IDLE STATE */}
      {!isScanning && !scanResult && !error && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
                <div className="relative w-24 h-24 bg-neutral-900 border border-white/10 rounded-3xl flex items-center justify-center">
                    <ScanLine size={40} className="text-blue-500" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ticket Scanner</h2>
            <p className="text-neutral-500 text-sm mb-8">
               Active Date: <span className="text-white font-mono">{todayDate}</span>
            </p>
            
            <button
                onClick={() => setIsScanning(true)}
                className="px-10 py-5 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 transition shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
                <Camera size={20} /> 
                Start Scanning
            </button>
        </div>
      )}

      {/* 2. SCANNING STATE */}
      {isScanning && (
        <div className="flex-1 relative w-full h-full bg-black overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <Scanner
                    onScan={handleScan}
                    formats={['qr_code']}
                    components={{ finder: false }}
                    styles={{
                        container: { width: "100%", height: "100%" },
                        video: { objectFit: "cover", width: "100%", height: "100%" }
                    }}
                />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-[scan_2s_infinite]" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                </div>
            </div>
            <p className="absolute bottom-24 left-0 right-0 text-center text-white/70 font-medium z-10">
               Verifying for <span className="text-white font-bold bg-white/10 px-2 py-1 rounded font-mono">{todayDate}</span>
            </p>
        </div>
      )}

      {/* 3. LOADING STATE */}
      {loading && (
          <div className="flex-1 flex flex-col items-center justify-center bg-black">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-neutral-400 font-mono">Verifying...</p>
          </div>
      )}

      {/* 4. SUCCESS RESULT */}
      {scanResult && (
         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black animate-in fade-in zoom-in duration-300">
             <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <CheckCircle size={48} className="text-black" strokeWidth={3} />
             </div>
             
             <h2 className="text-3xl font-bold text-white mb-2">Allowed</h2>
             
             <p className="text-white font-bold text-xl mb-3">{scanResult.attendee?.name}</p>

             {/* 🟢 Role and Registration Number */}
             <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                {scanResult.role && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        scanResult.role.includes("MAHE") 
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                        : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                    }`}>
                        {scanResult.role}
                    </span>
                )}
                {scanResult.regNumber && (
                    <span className="bg-neutral-800 text-neutral-300 border border-white/10 px-3 py-1 rounded-full text-xs font-mono font-bold">
                        Reg: {scanResult.regNumber}
                    </span>
                )}
             </div>
             
             {/* Details Box */}
             <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-sm border border-white/10 mb-8 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-neutral-500 text-sm font-medium">Event</span>
                    <span className="text-white text-sm font-bold">{scanResult.eventName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-sm font-medium">Gate / Day</span>
                    <div className="text-right">
                        <span className="text-white text-sm font-bold block">
                            {getDisplayDay(scanResult.day)}
                        </span>
                        <span className="text-neutral-500 text-xs font-mono mt-1 block">
                            {scanResult.day}
                        </span>
                    </div>
                </div>
             </div>
             
             <button onClick={resetScan} className="w-full max-w-sm py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition">
                Scan Next
             </button>
         </div>
      )}

      {/* 5. ERROR RESULT */}
      {error && (
         <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black animate-in fade-in zoom-in duration-300">
             <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(239,68,68,0.4)]">
                <AlertCircle size={48} className="text-black" strokeWidth={3} />
             </div>
             <h2 className="text-3xl font-bold text-white mb-2">Denied</h2>
             <p className="text-red-400 mb-8 text-lg max-w-xs mx-auto">{error}</p>
             
             <button onClick={resetScan} className="w-full max-w-sm py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition">
                Try Again
             </button>
         </div>
      )}
      
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}