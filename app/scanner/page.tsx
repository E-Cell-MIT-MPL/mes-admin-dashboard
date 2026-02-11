"use client";

import React, { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";

export default function SimpleScanner() {
  const [rawData, setRawData] = useState<string>("No QR detected yet...");

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    const value = detectedCodes[0]?.rawValue;
    if (value) {
      setRawData(value);
      // Optional: Log it to console to see hidden characters
      console.log("Scanned Data:", value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">Raw QR Reader</h1>

      {/* SCANNER CONTAINER 
         - We flip the video horizontally (scaleX(-1)) to make aiming easier 
      */}
      <div className="w-full max-w-md bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative">
        <Scanner
          onScan={handleScan}
          onError={(err) => console.log(err)}
          formats={['qr_code']} // Look ONLY for QR codes
          components={{ finder: true }} // Show the little red square
          styles={{
            container: { height: "350px" },
            video: { transform: "scaleX(-1)" } // Flips preview like a mirror
          }}
        />
      </div>

      {/* RESULT DISPLAY */}
      <div className="mt-6 w-full max-w-md p-4 bg-gray-800 rounded-lg border border-gray-600 break-all">
        <p className="text-gray-400 text-xs uppercase font-bold mb-2">
          Scanned Content:
        </p>
        <p className="text-green-400 font-mono text-lg">
          {rawData}
        </p>
      </div>

      <button 
        onClick={() => setRawData("Scanning...")}
        className="mt-8 px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition"
      >
        Clear / Reset
      </button>
    </div>
  );
}