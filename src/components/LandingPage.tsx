import React from "react";
import { 
  ShieldCheck, 
  Search, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  BrainCircuit, 
  Lock,
  Globe,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight">News Authentix</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#categories" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Categories</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
              Log in
            </Link>
            <Link to="/login" className="bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8">
              <Zap className="w-3 h-3 fill-current" />
              Next-Gen News Verification
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
              News Authentix
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Enterprise-Grade News Verification Platform. Advanced ML-powered system that detects fake news using hybrid NLP, transformer models, and explainable AI to combat misinformation at scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Try Demo
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl shadow-slate-900/20 border border-slate-800">
              <div className="aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <div className="text-slate-700 font-display text-2xl font-bold">Interactive Dashboard Preview</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">Powerful Verification Engine</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Built on industry-standard ML architectures for maximum accuracy and reliability.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-6 h-6 text-blue-600" />}
              title="Hybrid ML Engine"
              description="Combines traditional ML (LR, SVM, RF) with BERT/RoBERTa transformers for 94%+ accuracy."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-emerald-600" />}
              title="Real-Time Analysis"
              description="Get verification results in under 2.5 seconds with comprehensive confidence scores."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
              title="Explainable AI"
              description="LIME-powered explainability highlights suspicious words and patterns with evidence maps."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-rose-600" />}
              title="Source Credibility"
              description="Cross-reference with trusted source database and domain trust scoring."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-4xl font-display font-bold mb-4">How It Works</h2>
              <p className="text-slate-400">Simple three-step verification process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <Step 
                number="01"
                title="Submit Content"
                description="Paste news text, provide URL, or use our API for automated ingestion."
              />
              <Step 
                number="02"
                title="AI Analysis"
                description="Multi-stage ML pipeline processes text with NLP preprocessing and transformer encoding."
              />
              <Step 
                number="03"
                title="Get Results"
                description="Receive classification with confidence score and explainability visualization."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Classification Categories */}
      <section id="categories" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">Classification Categories</h2>
            <p className="text-slate-600">Our system categorizes news into three distinct levels of authenticity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard 
              type="Authentic"
              color="emerald"
              icon={<CheckCircle2 className="w-8 h-8" />}
              description="Verified factual content from credible sources with high confidence scoring."
            />
            <CategoryCard 
              type="Misleading"
              color="amber"
              icon={<AlertTriangle className="w-8 h-8" />}
              description="Partially accurate but contains misleading elements, exaggerations, or lacks context."
            />
            <CategoryCard 
              type="Fake/Deceptive"
              color="rose"
              icon={<XCircle className="w-8 h-8" />}
              description="Fabricated or intentionally deceptive content designed to misinform."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Ready to Combat Misinformation?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join organizations using News Authentix to verify information at scale and protect public discourse.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg">
              Start Verifying Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">News Authentix</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 News Authentix. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Globe size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors"><Lock size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative">
      <div className="text-6xl font-display font-black text-white/5 mb-6">{number}</div>
      <div className="absolute top-8 left-0">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mb-4 shadow-lg shadow-blue-600/40">
          {number.replace(/^0/, '')}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="h-40" /> {/* Spacer for absolute positioning */}
    </div>
  );
}

function CategoryCard({ type, color, icon, description }: { type: string, color: 'emerald' | 'amber' | 'rose', icon: React.ReactNode, description: string }) {
  const colors = {
    emerald: "bg-emerald-500/5 border-emerald-500/20 text-emerald-600",
    amber: "bg-amber-500/5 border-amber-500/20 text-amber-600",
    rose: "bg-rose-500/5 border-rose-500/20 text-rose-600"
  };

  return (
    <div className={cn("p-8 rounded-3xl border text-center flex flex-col items-center group hover:scale-[1.02] transition-all", colors[color])}>
      <div className="mb-6 group-hover:rotate-12 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{type}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  );
}

function XCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
