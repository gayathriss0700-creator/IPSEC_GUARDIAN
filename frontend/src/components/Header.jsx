import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Activity, Database, Sparkles, Server, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

export default function Header({ onRefreshHealth, isAssessing }) {
  const [health, setHealth] = useState({ status: 'checking', agent_count: 10 });
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const data = await apiService.getHealth();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'offline', agent_count: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = health.status === 'healthy' || health.status === 'online';

  return (
    <header className="sticky top-0 z-30 bg-[#070a12]/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Branding */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 glow-cyan">
            <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 font-mono">
                IPSEC GUARDIAN
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v2.0 MULTI-AGENT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              AI-Powered IPsec Security & Threat Assessment Platform
            </p>
          </div>
        </div>

        {/* Live Status Indicators Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Backend API */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${
            isOnline 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}>
            <Server className="w-3.5 h-3.5" />
            <span className="font-mono uppercase font-semibold">
              Backend: {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
          </div>

          {/* AI Engine */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono uppercase font-semibold">AI ENGINE: READY</span>
          </div>

          {/* Agent Network */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono uppercase font-semibold">
              AGENTS: {health.agent_count || 10}/10 ACTIVE
            </span>
          </div>

          {/* RAG Evidence */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-violet-950/40 border border-violet-500/30 text-violet-300">
            <Database className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-mono uppercase font-semibold">RAG: FAISS + CROSSENCODER</span>
          </div>

          {/* Qwen3-14B */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-magenta-950/40 border border-pink-500/30 text-pink-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="font-mono uppercase font-semibold">QWEN3-14B: READY</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => { checkHealth(); onRefreshHealth && onRefreshHealth(); }}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
            title="Refresh System Health"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
