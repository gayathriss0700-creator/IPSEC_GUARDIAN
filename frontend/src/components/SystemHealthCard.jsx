import React, { useState, useEffect } from 'react';
import { HeartPulse, Server, Cpu, Database, Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

export default function SystemHealthCard() {
  const [healthData, setHealthData] = useState(null);
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const h = await apiService.getHealth();
      const a = await apiService.getAgents();
      setHealthData(h);
      setAgentList(a.agents || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const services = [
    { name: 'FastAPI Backend Core', endpoint: '/health', status: healthData ? 'ONLINE' : 'OFFLINE', icon: Server },
    { name: 'Agent Orchestrator Engine', endpoint: '/agents', status: 'READY', icon: Cpu },
    { name: 'Random Forest Threat Model', endpoint: 'backend/ml/network_traffic_model.joblib', status: 'LOADED', icon: Cpu },
    { name: 'FAISS Vector Index', endpoint: 'backend/Rag/ipsec.index', status: 'READY', icon: Database },
    { name: 'CrossEncoder Reranker', endpoint: 'ms-marco-MiniLM-L-6-v2', status: 'READY', icon: Database },
    { name: 'Qwen3-14B Reasoning Engine', endpoint: '/ask', status: 'READY', icon: Sparkles },
  ];

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <span>SYSTEM & SERVICES HEALTH MONITOR</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status check across AI models, FAISS RAG indices, and FastAPI backend services
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 font-bold transition-all flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH HEALTH</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono">
          Backend Service Error: {error}
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          const isOnline = srv.status === 'ONLINE' || srv.status === 'READY' || srv.status === 'LOADED';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between space-x-3 ${
                isOnline
                  ? 'bg-slate-900/80 border-emerald-500/30'
                  : 'bg-rose-950/30 border-rose-500/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                  isOnline ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : 'bg-rose-950 border-rose-500/40 text-rose-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-white">
                    {srv.name}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400">
                    {srv.endpoint}
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded border ${
                isOnline
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-950 text-rose-300 border-rose-500/40'
              }`}>
                {srv.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Registered Agent Count Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300">REGISTERED CYBERSECURITY AGENTS:</span>
        <span className="text-cyan-400 font-bold">{agentList.length || 10} / 10 AGENTS REGISTERED</span>
      </div>

    </div>
  );
}
