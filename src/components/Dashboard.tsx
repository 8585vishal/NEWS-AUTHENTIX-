import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Search, 
  History, 
  BarChart3, 
  LogOut, 
  ChevronRight,
  Info,
  ExternalLink,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Globe,
  Zap,
  LayoutDashboard,
  FileText,
  Activity,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { auth, db } from "../firebase";
import { 
  onAuthStateChanged, 
  signOut,
  User
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { VerificationResult, PredictionHistory } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"verify" | "history" | "analytics" | "feed">("verify");
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const fetchNewsFeed = async () => {
    setIsLoadingFeed(true);
    setFeedError(null);
    try {
      const response = await fetch("/api/news-feed");
      const data = await response.json();
      if (data.error) {
        setFeedError(data.error);
        setNewsFeed([]);
      } else if (Array.isArray(data)) {
        setNewsFeed(data);
      } else {
        setNewsFeed([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch news feed", error);
      setFeedError(error.message || "Failed to load news feed");
      setNewsFeed([]);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    if (activeTab === "feed") {
      fetchNewsFeed();
    }
  }, [activeTab]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "predictions"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PredictionHistory[];
        setHistory(docs);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = () => signOut(auth);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText && !inputUrl) return;

    setIsVerifying(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, url: inputUrl }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Verification failed");
      }

      const data = await response.json();
      setResult(data);

      if (user) {
        const path = "predictions";
        try {
          await addDoc(collection(db, path), {
            userId: user.uid,
            text: inputText,
            url: inputUrl,
            result: data,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, "create" as any, path);
        }
      }
    } catch (error: any) {
      console.error("Verification failed", error);
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFirestoreError = (error: any, operationType: string, path: string) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Initializing News Authentix...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    { label: "Total Verifications", value: history.length, icon: <Activity className="text-blue-500" />, trend: "+12%" },
    { label: "Authentic News", value: history.filter(h => h.result.classification === "Authentic").length, icon: <ShieldCheck className="text-emerald-500" />, trend: "84%" },
    { label: "Misleading/Fake", value: history.filter(h => h.result.classification !== "Authentic").length, icon: <AlertTriangle className="text-amber-500" />, trend: "16%" },
    { label: "Avg. Confidence", value: history.length ? Math.round(history.reduce((acc, curr) => acc + curr.result.confidence, 0) / history.length) + "%" : "0%", icon: <Zap className="text-purple-500" />, trend: "Stable" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 flex flex-col bg-[#0F172A] text-white">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">Authentix</span>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-8">
          <div>
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Main Menu</p>
            <nav className="space-y-1">
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                label="Overview" 
                active={activeTab === "verify"} 
                onClick={() => setActiveTab("verify")} 
              />
              <SidebarItem 
                icon={<History size={20} />} 
                label="Verification History" 
                active={activeTab === "history"} 
                onClick={() => setActiveTab("history")} 
              />
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                label="Analytics Insights" 
                active={activeTab === "analytics"} 
                onClick={() => setActiveTab("analytics")} 
              />
              <SidebarItem 
                icon={<Globe size={20} />} 
                label="Global News Feed" 
                active={activeTab === "feed"} 
                onClick={() => setActiveTab("feed")} 
              />
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Support</p>
            <nav className="space-y-1">
              <SidebarItem 
                icon={<HelpCircle size={20} />} 
                label="Documentation" 
                onClick={() => {}} 
              />
              <SidebarItem 
                icon={<Info size={20} />} 
                label="System Status" 
                onClick={() => {}} 
              />
            </nav>
          </div>
        </div>

        <div className="p-6 mt-auto">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img src={user.photoURL || ""} className="w-10 h-10 rounded-full border-2 border-blue-500/20" alt="User" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-rose-600 text-white rounded-xl transition-all group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-xs text-slate-500 font-medium">Welcome back, {user.displayName?.split(' ')[0]}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">System Online</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
              <Activity size={20} />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-lg",
                    stat.trend.includes('+') || stat.trend.includes('%') ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-2xl font-display font-black text-slate-900">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {activeTab === "verify" && (
            <div className="space-y-10">
              <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-slate-900">Instant Verification</h3>
                    <p className="text-xs text-slate-500 font-medium">Input news content or a URL for deep AI analysis</p>
                  </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-8">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-rose-600 mb-1">System Error</p>
                        <p className="text-sm text-rose-500/80 leading-relaxed">{error}</p>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="relative group">
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-48 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all outline-none resize-none font-medium text-lg placeholder:text-slate-300"
                      placeholder="Paste news text here for deep analysis..."
                    />
                    <div className="absolute bottom-6 right-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      {inputText.length} Characters
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Globe size={18} />
                      </div>
                      <input 
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none transition-all font-medium"
                        placeholder="https://news-source.com/article"
                      />
                    </div>
                    <button 
                      disabled={isVerifying || (!inputText && !inputUrl)}
                      className="px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 group"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing Engine...</span>
                        </>
                      ) : (
                        <>
                          <Search size={20} className="group-hover:scale-110 transition-transform" />
                          <span>Verify Authenticity</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>

              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Verdict Card */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className={cn(
                        "p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-start gap-8 relative overflow-hidden",
                        result.classification === "Authentic" ? "bg-emerald-50 border-emerald-100" :
                        result.classification === "Misleading" ? "bg-amber-50 border-amber-100" :
                        "bg-rose-50 border-rose-100"
                      )}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        
                        <div className={cn(
                          "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg",
                          result.classification === "Authentic" ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                          result.classification === "Misleading" ? "bg-amber-500 text-white shadow-amber-500/20" :
                          "bg-rose-500 text-white shadow-rose-500/20"
                        )}>
                          {result.classification === "Authentic" ? <ShieldCheck size={48} /> :
                           result.classification === "Misleading" ? <AlertTriangle size={48} /> :
                           <XCircle size={48} />}
                        </div>
                        <div className="flex-1 relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={cn(
                              "text-3xl font-display font-black",
                              result.classification === "Authentic" ? "text-emerald-700" :
                              result.classification === "Misleading" ? "text-amber-700" :
                              "text-rose-700"
                            )}>{result.classification}</h4>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Confidence Score</span>
                              <span className="text-2xl font-display font-black text-slate-900">{result.confidence}%</span>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-white/50 rounded-full overflow-hidden mb-6">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${result.confidence}%` }}
                              className={cn(
                                "h-full",
                                result.classification === "Authentic" ? "bg-emerald-500" :
                                result.classification === "Misleading" ? "bg-amber-500" :
                                "bg-rose-500"
                              )}
                            />
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed text-lg">{result.reasoning}</p>
                        </div>
                      </div>

                      {/* Evidence Map */}
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <h4 className="text-xl font-display font-bold text-slate-900 flex items-center gap-3">
                            <BarChart3 size={24} className="text-blue-600" />
                            LIME Evidence Analysis
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Explainable AI</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {result.evidence?.map((item, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex gap-6 group hover:bg-white hover:shadow-md transition-all"
                            >
                              <div className={cn(
                                "w-1.5 h-full rounded-full shrink-0",
                                item.sentiment === "Positive" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" :
                                item.sentiment === "Negative" ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" :
                                "bg-slate-300"
                              )} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-slate-900 font-bold text-lg italic">"{item.phrase}"</p>
                                  <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm">
                                    {item.type}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.explanation}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Source Credibility */}
                    <div className="space-y-8">
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm text-center">
                        <h4 className="text-lg font-display font-bold text-slate-900 mb-8 flex items-center justify-center gap-2">
                          <Globe size={20} className="text-blue-600" />
                          Source Trust Index
                        </h4>
                        {result.sourceCredibility ? (
                          <div className="space-y-8">
                            <div className="relative w-40 h-40 mx-auto">
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                                <motion.circle 
                                  cx="50" cy="50" r="42" fill="none" 
                                  stroke={result.sourceCredibility.score > 70 ? "#10b981" : result.sourceCredibility.score > 40 ? "#f59e0b" : "#f43f5e"}
                                  strokeWidth="10" 
                                  strokeDasharray="264"
                                  initial={{ strokeDashoffset: 264 }}
                                  animate={{ strokeDashoffset: 264 - (264 * result.sourceCredibility.score) / 100 }}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-display font-black text-slate-900">{result.sourceCredibility.score}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Score</span>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-sm text-slate-500 font-medium leading-relaxed">{result.sourceCredibility.details}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Info className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 text-sm font-medium">No URL provided for<br/>source analysis.</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                        <h4 className="text-xl font-display font-bold mb-4">Enterprise API</h4>
                        <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">Integrate News Authentix into your high-performance workflow with our REST API.</p>
                        <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl text-sm hover:bg-blue-50 transition-all shadow-lg">
                          Get API Key
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "feed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isLoadingFeed ? (
                <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning Global Sources...</p>
                </div>
              ) : feedError ? (
                <div className="col-span-full p-10 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold text-slate-900 mb-2">News Feed Unavailable</h4>
                    <p className="text-sm text-slate-500 max-w-md leading-relaxed">{feedError}</p>
                  </div>
                  {feedError.includes("GEMINI_API_KEY") && (
                    <div className="p-6 bg-white rounded-2xl border border-rose-100 text-left w-full max-w-lg">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Resolution Steps:</p>
                      <ol className="text-xs text-slate-500 space-y-3 list-decimal ml-4 font-medium">
                        <li>Open the <strong>Settings</strong> (gear icon) in the top right.</li>
                        <li>Navigate to the <strong>Secrets</strong> tab.</li>
                        <li>Add a secret named <code>GEMINI_API_KEY</code>.</li>
                        <li>Paste your API key from Google AI Studio.</li>
                      </ol>
                    </div>
                  )}
                  <button 
                    onClick={fetchNewsFeed}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : Array.isArray(newsFeed) && newsFeed.length > 0 ? (
                newsFeed.map((article, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                  >
                    {article.image && (
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-6 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-900">
                          {article.source}
                        </div>
                      </div>
                    )}
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{article.source}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xl font-display font-bold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{article.title}</h4>
                      <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-3 flex-1 leading-relaxed">{article.description}</p>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => {
                            setInputUrl(article.url);
                            setInputText("");
                            setActiveTab("verify");
                          }}
                          className="px-6 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                        >
                          Verify with AI <ChevronRight size={14} />
                        </button>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Globe className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No global news available at this time.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-slate-900">Verification History</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {history.length} Records Found
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Content</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verdict</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confidence</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-6 text-xs font-bold text-slate-400">
                          {item.timestamp?.toDate().toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm text-slate-900 font-bold truncate max-w-xs">{item.text || item.url}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{item.url ? "Source URL" : "Raw Text"}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5",
                            item.result.classification === "Authentic" ? "bg-emerald-50 text-emerald-600" :
                            item.result.classification === "Misleading" ? "bg-amber-50 text-amber-600" :
                            "bg-rose-50 text-rose-600"
                          )}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              item.result.classification === "Authentic" ? "bg-emerald-500" :
                              item.result.classification === "Misleading" ? "bg-amber-500" :
                              "bg-rose-500"
                            )} />
                            {item.result.classification}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-display font-black text-slate-900">{item.result.confidence}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full",
                                  item.result.classification === "Authentic" ? "bg-emerald-500" :
                                  item.result.classification === "Misleading" ? "bg-amber-500" :
                                  "bg-rose-500"
                                )}
                                style={{ width: `${item.result.confidence}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <button 
                            onClick={() => {
                              setResult(item.result);
                              setInputText(item.text);
                              setInputUrl(item.url || "");
                              setActiveTab("verify");
                            }}
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all group-hover:scale-110"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {history.length === 0 && (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <History className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No verification history found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h4 className="text-lg font-display font-bold text-slate-900">Classification Distribution</h4>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Authentic", value: history.filter(h => h.result.classification === "Authentic").length },
                            { name: "Misleading", value: history.filter(h => h.result.classification === "Misleading").length },
                            { name: "Fake", value: history.filter(h => h.result.classification === "Fake").length },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#f43f5e" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#ffffff", border: "none", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}
                          itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-8 mt-6">
                    <LegendItem color="bg-emerald-500" label="Authentic" />
                    <LegendItem color="bg-amber-500" label="Misleading" />
                    <LegendItem color="bg-rose-500" label="Fake" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h4 className="text-lg font-display font-bold text-slate-900">Confidence Trends</h4>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Activity size={20} />
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history.slice(0, 15).reverse()}>
                        <defs>
                          <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="id" hide />
                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#ffffff", border: "none", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}
                          itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
                        />
                        <Area type="monotone" dataKey="result.confidence" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorConf)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative",
        active ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
      )}
    >
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
        />
      )}
      <div className={cn(
        "transition-colors",
        active ? "text-white" : "text-slate-500 group-hover:text-blue-400"
      )}>
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}
