import React, { useState } from 'react';
import { FlaskConical, Play, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';
import { apiService } from '../services/api';

export default function WhatIfSimulationLab({ currentConfig, simulationData, onSimulationComplete }) {
  const [selectedScenario, setSelectedScenario] = useState('disable_pfs');
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState(simulationData || null);
  const [error, setError] = useState(null);

  const handleRunSim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.runSimulation(currentConfig || {}, selectedScenario);
      setSimResult(res);
      if (onSimulationComplete) onSimulationComplete(res);
    } catch (err) {
      setError(err.message || 'Simulation execution failed');
    } finally {
      setLoading(false);
    }
  };

  const baselineScore = simResult?.baseline_score ?? 85;
  const simulatedScore = simResult?.simulated_score ?? 60;
  const scoreDelta = simResult?.score_delta ?? (simulatedScore - baselineScore);

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 flex items-center space-x-2">
            <FlaskConical className="w-5 h-5 text-pink-400" />
            <span>SECURITY WHAT-IF LAB (ATTACK SIMULATION AGENT)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Safe configuration-level impact forecasting without altering production network traffic
          </p>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[11px] font-mono font-semibold flex items-center space-x-1.5 shrink-0">
          <Info className="w-4 h-4 text-purple-400" />
          <span>SAFE CONFIGURATION SIMULATION — NO REAL ATTACK EXECUTED</span>
        </div>
      </div>

      {/* Scenario Selector & Controls */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <label className="text-xs font-mono text-cyan-400 font-bold block">
          SELECT WHAT-IF SIMULATION SCENARIO:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          <button
            type="button"
            onClick={() => setSelectedScenario('disable_pfs')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              selectedScenario === 'disable_pfs'
                ? 'bg-pink-950/60 border-pink-500 text-pink-300 glow-magenta'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white mb-1">Scenario #1</div>
            <div>Disable Perfect Forward Secrecy (PFS)</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('weak_encryption')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              selectedScenario === 'weak_encryption'
                ? 'bg-pink-950/60 border-pink-500 text-pink-300 glow-magenta'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white mb-1">Scenario #2</div>
            <div>Downgrade Encryption to 3DES</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('no_anti_replay')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              selectedScenario === 'no_anti_replay'
                ? 'bg-pink-950/60 border-pink-500 text-pink-300 glow-magenta'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white mb-1">Scenario #3</div>
            <div>Disable Anti-Replay Protection</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScenario('broad_selectors')}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
              selectedScenario === 'broad_selectors'
                ? 'bg-pink-950/60 border-pink-500 text-pink-300 glow-magenta'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-white mb-1">Scenario #4</div>
            <div>Broad Traffic Selectors (0.0.0.0/0)</div>
          </button>

        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunSim}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono text-xs font-bold shadow-lg glow-magenta transition-all flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>SIMULATING IMPACT...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>EXECUTE WHAT-IF SIMULATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* Before / After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Baseline Gauge */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            BASELINE SCORE
          </span>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {baselineScore}/100
          </div>
          <span className="text-xs font-mono text-slate-400 block">Current Configuration</span>
        </div>

        {/* Delta Card */}
        <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-center space-y-2 glow-violet">
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block">
            SIMULATED IMPACT DELTA
          </span>
          <div className={`text-4xl font-black font-mono ${scoreDelta <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta} PTS
          </div>
          <span className="text-xs font-mono text-purple-300 block font-semibold">
            {simResult?.risk_impact || 'SECURITY DEGRADATION'}
          </span>
        </div>

        {/* Simulated Gauge */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            SIMULATED SCORE
          </span>
          <div className="text-3xl font-black font-mono text-pink-400">
            {simulatedScore}/100
          </div>
          <span className="text-xs font-mono text-slate-400 block">After Scenario Applied</span>
        </div>

      </div>

      {/* Simulation Explanation Text */}
      {simResult?.explanation && (
        <div className="p-4 rounded-xl bg-[#060810] border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed">
          <strong className="text-pink-400 font-bold block mb-1">Scenario Security Analysis:</strong>
          {simResult.explanation}
        </div>
      )}

    </div>
  );
}
