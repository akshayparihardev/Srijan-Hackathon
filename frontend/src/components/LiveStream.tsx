"use client";

import { useState, useEffect } from "react";
import { Play, Square, ActivitySquare } from "lucide-react";
import { type MachineData } from "@/types";
import { cn } from "@/lib/utils";

interface LiveStreamProps {
  machines: MachineData[];
  onLogStreamed: (log: MachineData) => void;
}

export function LiveStream({ machines, onLogStreamed }: LiveStreamProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || machines.length === 0) return;

    const interval = setInterval(() => {
      const randomMachine = machines[Math.floor(Math.random() * machines.length)];
      const riskChange = Math.floor(Math.random() * 21) - 10;
      let newRisk = Math.max(0, Math.min(100, randomMachine.risk + riskChange));

      const log: MachineData = {
        ...randomMachine,
        risk: newRisk,
        priority: newRisk >= 80 ? "CRITICAL" : newRisk >= 50 ? "MEDIUM" : "LOW",
        explanation: `Simulated live telemetry anomaly detected. Risk variance computed: ${riskChange > 0 ? "+" : ""}${riskChange}.`,
        deadline: newRisk >= 80 ? "Immediate" : newRisk >= 50 ? "Net 7 days" : "Stable",
      };

      onLogStreamed(log);
    }, 4500);

    return () => clearInterval(interval);
  }, [isActive, machines, onLogStreamed]);

  return (
    <div className="glass-panel flex items-center justify-between p-8 rounded-2xl h-full relative overflow-hidden group">
      {isActive && (
        <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-xl pointer-events-none transition-all duration-1000" />
      )}
      <div className="flex flex-col space-y-2 relative z-10 w-full max-w-[60%]">
        <h3 className="text-xl font-bold text-zinc-50 tracking-tight flex items-center">
          <ActivitySquare className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
          Live Telemetry
        </h3>
        <p className="text-sm font-medium text-zinc-500 flex items-center mt-1">
          <span className="relative flex h-2.5 w-2.5 mr-2">
            {isActive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-600"></span>
            )}
          </span>
          {isActive ? "Receiving node events..." : "Stream disconnected"}
        </p>
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className={cn(
          "relative z-10 flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl transition-all border shadow-sm",
          isActive
            ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
            : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white"
        )}
      >
        {isActive ? (
          <>
            <Square className="w-4 h-4 mr-2" /> Terminate Stream
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2 ml-1" /> Initialize Stream
          </>
        )}
      </button>
    </div>
  );
}
