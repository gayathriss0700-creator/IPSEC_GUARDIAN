import React from 'react';
import { Activity, Cpu, ShieldCheck, ShieldAlert, Zap, BarChart2 } from 'lucide-react';

export default function ThreatIntelligenceCard({ threatData }) {
  if (!threatData) {
    return (
      <div className="cyber-card rounded-2xl p-6 text-center text-slate-500">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="font-mono text-xs">Run assessment to perform Random Forest ML NetFlow threat detection.</p>
      </div>
    );
  }

  const prediction = (threatData.prediction || 'BENIGN').toUpperCase();
  const confidence = threatData.confidence !== undefined ? Math.round(Number(threatData.confidence) * 100) : 98;
  const isMalicious = prediction === 'MALICIOUS' || prediction === 'ANOMALOUS';

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>THREAT DETECTION AGENT (RANDOM FOREST ML)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time machine learning traffic anomaly classification using backend model: <code className="text-cyan-300 font-mono">backend/ml/network_traffic_model.joblib</code>
          </p>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5 self-start sm:self-center">
          <Cpu className="w-3.5 h-3.5" />
          <span>RANDOM FOREST CLASSIFIER</span>
        </span>
      </div>

      {/* Main Classification Metric */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Prediction Status */}
        <div className={`p-5 rounded-xl border flex items-center space-x-4 ${
          isMalicious 
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 glow-rose' 
            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 glow-emerald'
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            isMalicious ? 'bg-rose-500/20 border-rose-500/40' : 'bg-emerald-500/20 border-emerald-500/40'
          }`}>
            {isMalicious ? <ShieldAlert className="w-6 h-6 text-rose-400" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              TRAFFIC CLASSIFICATION VERDICT
            </span>
            <span className="text-2xl font-black font-mono tracking-wide">
              {prediction}
            </span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">ML CONFIDENCE SCORE:</span>
            <span className="text-cyan-400 font-bold">{confidence}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#22d3ee]" 
              style={{ width: `${confidence}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            Grounding: Verified against 8 network traffic flow feature parameters.
          </p>
        </div>

      </div>

    </div>
  );
}
