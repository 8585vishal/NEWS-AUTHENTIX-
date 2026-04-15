import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  BarChart3, 
  Zap, 
  Globe, 
  Activity,
  History,
  LayoutDashboard,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function DashboardPreview() {
  const [step, setStep] = useState(0);
  
  // Cycle through steps: 0: Idle, 1: Typing, 2: Verifying, 3: Result
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full bg-[#F8FAFC] flex overflow-hidden text-[10px] select-none pointer-events-none">
      {/* Sidebar */}
      <div className="w-48 bg-[#0F172A] flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
          <div className="h-2 w-16 bg-slate-700 rounded" />
        </div>
        
        <div className="px-4 py-4 space-y-4">
          {[
            { icon: <LayoutDashboard size={14} />, active: true },
            { icon: <History size={14} /> },
            { icon: <BarChart3 size={14} /> },
            { icon: <Globe size={14} /> }
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${item.active ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500'}`}>
              {item.icon}
              <div className={`h-1.5 w-16 rounded ${item.active ? 'bg-blue-500/50' : 'bg-slate-800'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6">
          <div className="h-2 w-24 bg-slate-100 rounded" />
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-16 bg-emerald-50 rounded-full border border-emerald-100" />
            <div className="w-8 h-8 bg-slate-100 rounded-full" />
          </div>
        </header>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Verifications", value: "1,284", color: "text-blue-600" },
              { label: "Authentic", value: "842", color: "text-emerald-600" },
              { label: "Misleading", value: "312", color: "text-amber-600" },
              { label: "Confidence", value: "94%", color: "text-purple-600" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Verification Area */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <div className="h-2 w-32 bg-slate-100 rounded" />
            </div>

            <div className="relative">
              <div className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-400 font-medium overflow-hidden">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.p 
                      key="idle"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="text-slate-300"
                    >
                      Paste news text here for deep analysis...
                    </motion.p>
                  )}
                  {step >= 1 && (
                    <motion.p 
                      key="typing"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-slate-600 leading-relaxed"
                    >
                      {step === 1 ? "Analyzing recent reports regarding global climate policy shifts and their economic impact on emerging markets..." : "Analyzing recent reports regarding global climate policy shifts and their economic impact on emerging markets..."}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center gap-2">
                <Globe size={12} className="text-slate-300" />
                <div className="h-1.5 w-32 bg-slate-200 rounded" />
              </div>
              <div className={`px-6 h-10 rounded-xl flex items-center justify-center gap-2 transition-all ${step === 2 ? 'bg-blue-500' : 'bg-blue-600'} text-white font-bold`}>
                {step === 2 ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                <span>{step === 2 ? "Processing..." : "Verify Authenticity"}</span>
              </div>
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-x-6 -bottom-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-xl shadow-emerald-500/10 flex items-start gap-4 z-10"
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-emerald-700">Authentic</span>
                      <span className="text-[10px] font-bold text-emerald-600">98% Confidence</span>
                    </div>
                    <div className="h-1 w-full bg-emerald-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-emerald-500 w-[98%]" />
                    </div>
                    <p className="text-[9px] text-emerald-700/70 leading-tight">Content verified against 14 credible sources. No significant factual inconsistencies detected.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Evidence Map Mockup */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-2 w-32 bg-slate-100 rounded" />
              <div className="h-1.5 w-16 bg-slate-50 rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex gap-3">
                  <div className={`w-1 h-full rounded-full ${i === 1 ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                  <div className="flex-1 space-y-2">
                    <div className="h-1.5 w-24 bg-slate-200 rounded" />
                    <div className="h-1 w-full bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
