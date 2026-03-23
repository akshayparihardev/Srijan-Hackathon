"use client";

import { useRef } from "react";
import { type MachineData } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AlertCircle, Clock, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineDetailPanelProps {
  data: MachineData | null;
}

export function MachineDetailPanel({ data }: MachineDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (data && panelRef.current && contentRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
      );
      
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.1, ease: "power3.out" }
      );
    }
  }, [data]);

  if (!data) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center p-8 rounded-2xl h-full text-center relative overflow-hidden group">
        <Zap className="w-12 h-12 text-zinc-600 mb-5 opacity-40 group-hover:text-zinc-400 group-hover:scale-110 transition-all duration-700" />
        <p className="text-zinc-300 font-medium tracking-wide">Select a Node</p>
        <p className="text-sm text-zinc-500 mt-2">to view deep diagnostics and AI actions</p>
      </div>
    );
  }

  const isCritical = data.priority === "CRITICAL" || data.priority === "HIGH";

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex flex-col p-8 rounded-2xl h-full relative overflow-hidden transition-colors duration-700",
        "glass-panel",
        isCritical ? "border-red-500/20 bg-red-950/5 shadow-[0_0_30px_-10px_rgba(239,68,68,0.1)]" : ""
      )}
    >
      {isCritical && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start mb-8 pb-5 border-b border-white/5 relative z-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-50">{data.machine}</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">Diagnostic Report</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border",
            isCritical ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-zinc-500/10 text-zinc-300 border-zinc-500/20"
          )}
        >
          {data.priority} PRIORITY
        </span>
      </div>

      <div ref={contentRef} className="space-y-8 flex-1 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            <span className="flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Recommended Action</span>
          </div>
          <p className={cn("text-xl font-semibold tracking-tight", isCritical ? "text-red-100" : "text-zinc-100")}>
            {data.action}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            <Clock className="w-4 h-4 mr-2" /> Timeline
          </div>
          <p className={cn(
            "text-sm font-semibold px-4 py-2 rounded-lg inline-flex backdrop-blur-sm border",
            data.deadline.toLowerCase() === "immediate" 
              ? "text-red-300 border-red-500/20 bg-red-950/30"
              : "text-zinc-300 border-white/5 bg-white/5"
          )}>
            {data.deadline}
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            <Info className="w-4 h-4 mr-2" /> AI Explanation
          </div>
          <div className="p-5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
            <p className="text-sm leading-relaxed text-zinc-300/90 font-medium">
              {data.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
