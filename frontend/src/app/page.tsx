"use client";

import { useState, useEffect, useRef } from "react";
import { type MachineData } from "@/types";
import { getMachinesStatus } from "@/services/api";
import { MachineCard } from "@/components/MachineCard";
import { MachineDetailPanel } from "@/components/MachineDetailPanel";
import { LogInput } from "@/components/LogInput";
import { ChatAssistant } from "@/components/ChatAssistant";
import { LiveStream } from "@/components/LiveStream";
import { Activity, LayoutDashboard, Loader2, Sparkles } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function DashboardPage() {
  const [machines, setMachines] = useState<MachineData[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMachinesStatus();
        setMachines(data);
        if (data.length > 0) {
          setSelectedMachine(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch machines", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useGSAP(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(
        ".dashboard-item",
        { opacity: 0, scale: 0.98, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, [isLoading]);

  const handleUpdateMachine = (updatedLog: MachineData) => {
    setMachines((prev) => {
      const idx = prev.findIndex((m) => m.machine === updatedLog.machine);
      if (idx !== -1) {
        const newData = [...prev];
        newData[idx] = updatedLog;
        return newData;
      }
      return [...prev, updatedLog];
    });

    if (selectedMachine?.machine === updatedLog.machine) {
      setSelectedMachine(updatedLog);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-card-hover)_0%,_var(--color-background)_100%)] opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
          <span className="text-xl font-medium tracking-tight text-foreground/80 glowing-text">Initializing AI Core...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground p-4 md:p-8 selection:bg-primary/20" ref={containerRef}>
      <header className="mb-10 dashboard-item sticky top-0 z-50 glass-panel !rounded-2xl px-6 py-4 max-w-[1600px] mx-auto flex items-center justify-between mt-2">
        <div className="flex items-center space-x-5">
          <div className="p-2.5 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/5 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Activity className="w-5 h-5 text-zinc-100 relative z-10" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-50">Predictive Maintenance</h1>
            <p className="text-xs md:text-sm text-zinc-400 mt-0.5 font-medium tracking-wide">AI-Driven Equipment Intelligence</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-zinc-300">
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM NOMINAL
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Cards and Log Inputs */}
        <div className="xl:col-span-8 space-y-8 flex flex-col">
          <div className="dashboard-item grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <MachineCard
                key={machine.machine}
                data={machine}
                isSelected={selectedMachine?.machine === machine.machine}
                onClick={setSelectedMachine}
              />
            ))}
          </div>

          <div className="dashboard-item grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[380px]">
             <LogInput onLogAnalyzed={handleUpdateMachine} />
             <div className="flex flex-col gap-6 h-full">
                <div className="flex-1">
                  <LiveStream machines={machines} onLogStreamed={handleUpdateMachine} />
                </div>
                <div className="flex-1">
                  <div className="glass-panel flex flex-col items-center justify-center p-8 rounded-2xl h-full text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />
                    <Sparkles className="w-8 h-8 text-zinc-500 mb-4 opacity-50 group-hover:text-zinc-300 transition-colors duration-500" />
                    <p className="text-sm font-semibold text-zinc-100 tracking-tight">AI Telemetry Active</p>
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed max-w-[220px]">Quantum nodes are synchronized. Live matrices processing seamlessly.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Detail Panel and Chat Assistant */}
        <div className="xl:col-span-4 space-y-8 flex flex-col h-full">
          <div className="dashboard-item flex-1 min-h-[400px]">
            <MachineDetailPanel data={selectedMachine} />
          </div>
          <div className="dashboard-item flex-none">
            <ChatAssistant machines={machines} />
          </div>
        </div>
      </main>
    </div>
  );
}
