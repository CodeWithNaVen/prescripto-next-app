"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Sparkles, X } from "lucide-react";

const SymptomAIWidget = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Show widget after a short delay for "tempting" entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip / Teaser Bubble */}
      {showTooltip && (
        <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 max-w-[220px] animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
          <button 
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 bg-slate-100 hover:bg-slate-200 rounded-full p-1 text-slate-500 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Best for You</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            Feeling unwell? Let our model find the right doctor for you.
          </p>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => router.push("/recommend")}
        className="group relative flex items-center gap-3 bg-primary hover:bg-primary/90 text-white pl-4 pr-6 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(var(--primary-rgb),0.5)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Animated Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
        
        {/* Icon Container with Pulse */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
          <div className="relative bg-white/20 p-2 rounded-full">
            <BrainCircuit size={24} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-xs font-medium text-primary-foreground/80 leading-none mb-1">
            NexCare Doctor Finder
          </span>
          <span className="text-sm font-bold leading-none tracking-tight">
            Check Symptoms
          </span>
        </div>
      </button>

      {/* Internal CSS for the shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SymptomAIWidget;