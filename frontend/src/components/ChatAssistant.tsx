"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { type MachineData } from "@/types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const EXAMPLE_QUERIES = [
  "What is the most critical machine currently?",
  "Why was Motor_B flagged?",
];

interface ChatAssistantProps {
  machines: MachineData[];
}

export function ChatAssistant({ machines }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your AI assistant. How can I assist you with telemetry insights today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      let aiResponseText = "I analyze real-time node metrics to guarantee operational efficiency.";
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("most critical")) {
        const sorted = [...machines].sort((a, b) => b.risk - a.risk);
        if (sorted.length > 0) {
          const highest = sorted[0];
          aiResponseText = `The most critical node is **${highest.machine}** (Risk Index: ${highest.risk}). Action required: ${highest.action.toLowerCase()} by ${highest.deadline}.`;
        } else {
          aiResponseText = "There are no machines currently reporting data.";
        }
      } else if (lowerText.includes("why") && lowerText.includes("motor_b")) {
        const motorB = machines.find((m) => m.machine.toLowerCase() === "motor_b");
        if (motorB) {
          aiResponseText = `**${motorB.machine}** was flagged due to: ${motorB.explanation}. The variance requires attention.`;
        } else {
          aiResponseText = "I cannot find any telemetry for Motor_B currently.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiResponseText,
        },
      ]);
    }, 800);
  };

  return (
    <div className="glass-panel flex flex-col h-full min-h-[450px] rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md relative z-10">
        <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mr-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
        <h3 className="font-semibold text-sm tracking-wide text-zinc-100 uppercase">AI Copilot</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 relative z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-max max-w-[85%] flex-col gap-1.5 text-sm",
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center px-1">
              {msg.sender === "user" ? (
                <>You <User className="w-3 h-3 ml-1" /></>
              ) : (
                <><Bot className="w-3 h-3 mr-1" /> Nexus AI</>
              )}
            </span>
            <div
              className={cn(
                "rounded-2xl px-4 py-3 leading-relaxed shadow-sm backdrop-blur-md border",
                msg.sender === "user"
                  ? "bg-zinc-100 text-zinc-900 border-white rounded-tr-sm font-medium"
                  : "bg-black/40 text-zinc-300 border-white/10 rounded-tl-sm text-sm"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100 font-semibold">$1</strong>') }} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {EXAMPLE_QUERIES.map((q) => (
             <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs text-zinc-400 font-medium hover:bg-white/10 hover:text-zinc-100 transition-all"
             >
              {q}
             </button>
          ))}
        </div>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2 relative group"
        >
          <div className="absolute inset-0 bg-primary/5 blur-md rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Query telemetry matrix..."
            className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 relative z-10 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="rounded-xl bg-zinc-100 p-3 text-zinc-900 hover:bg-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 relative z-10 shadow-[0_0_15px_-5px_rgba(255,255,255,0.4)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
