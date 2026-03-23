"use client";

import { useRef } from "react";
import { type MachineData } from "@/types";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Activity } from "lucide-react";

interface MachineCardProps {
  data: MachineData;
  onClick: (data: MachineData) => void;
  isSelected: boolean;
}

export function MachineCard({ data, onClick, isSelected }: MachineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const riskRef = useRef<HTMLDivElement>(null);

  const getRiskColors = (risk: number, priority: string) => {
    if (priority === "CRITICAL" || risk >= 80) {
      return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]", indicator: "bg-red-500" };
    }
    if (risk >= 50) {
      return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]", indicator: "bg-amber-500" };
    }
    return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]", indicator: "bg-emerald-500" };
  };

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { scale: 1.02, y: -2, duration: 0.4, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { scale: 1, y: 0, duration: 0.4, ease: "power3.out" });
  };

  useGSAP(() => {
    if (riskRef.current) {
      gsap.fromTo(
        riskRef.current,
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }
      );
    }
  }, [data.risk]);

  const colors = getRiskColors(data.risk, data.priority);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      className={cn(
        "group relative flex flex-col p-6 rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden",
        "glass-panel hover:bg-card-hover",
        colors.glow,
        isSelected ? "ring-1 ring-zinc-500/50 bg-white/5" : ""
      )}
      onClick={() => onClick(data)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background ambient glow based on risk */}
      <div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000", colors.indicator)} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-lg backdrop-blur-md", colors.bg, colors.border, "border")}>
            <Activity className={cn("w-4 h-4", colors.text)} />
          </div>
          <h3 className="font-semibold text-lg text-zinc-100 tracking-tight">
            {data.machine}
          </h3>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border",
            colors.text,
            colors.border,
            colors.bg
          )}
        >
          {data.priority}
        </span>
      </div>

      <div className="flex items-end justify-between mt-auto relative z-10">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1.5">Risk Index</span>
          <div className="flex items-baseline gap-1.5" ref={riskRef}>
            <span className={cn("text-4xl font-bold tracking-tighter transition-colors duration-700", colors.text)}>
              {data.risk}
            </span>
            <span className="text-zinc-600 font-medium text-sm">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
