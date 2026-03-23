"use client";

import { useState, useRef } from "react";
import { Upload, FileJson, Loader2, Cpu } from "lucide-react";
import { type MachineData } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { uploadLogs } from "@/services/api";

interface LogInputProps {
  onLogAnalyzed: (log: MachineData) => void;
}

export function LogInput({ onLogAnalyzed }: LogInputProps) {
  const [inputData, setInputData] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const analyzingRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isAnalyzing && analyzingRef.current) {
      gsap.fromTo(
        analyzingRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3 }
      );
    }
  }, [isAnalyzing]);

  useGSAP(() => {
    if (error && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [error]);

  const handleAnalyze = async () => {
    if (!inputData.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await uploadLogs(inputData);
      onLogAnalyzed(result);
      setInputData("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to parse log data");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputData(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel flex flex-col p-8 rounded-2xl h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-xl font-bold tracking-tight text-zinc-50 mb-6 flex items-center">
        <Cpu className="w-5 h-5 mr-3 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        Manual Log Ingestion
      </h2>

      <div className="flex-1 flex flex-col space-y-5 relative z-10">
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder={'{\n  "machine": "Motor_B",\n  "risk": 82,\n  ... \n}'}
          className="flex-1 min-h-[160px] p-5 font-mono text-sm bg-black/40 border border-white/5 rounded-xl text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-500/50 resize-none transition-all placeholder:text-zinc-700"
          disabled={isAnalyzing}
        />
        
        <div className="flex items-center justify-between">
          <div className="relative">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAnalyzing}
            />
            <button className="flex items-center px-4 py-2.5 text-sm font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">
              <Upload className="w-4 h-4 mr-2" />
              Upload JSON
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputData.trim()}
            className="relative flex items-center px-6 py-2.5 text-sm font-semibold text-black bg-zinc-100 rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)]"
          >
            {isAnalyzing ? (
              <span ref={analyzingRef} className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-zinc-600" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <FileJson className="w-4 h-4 mr-2" />
                Analyze Matrix
              </span>
            )}
          </button>
        </div>

        {error && (
          <div ref={resultRef} className="p-4 text-sm font-medium text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl backdrop-blur-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
