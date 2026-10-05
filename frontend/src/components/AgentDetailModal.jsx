import React from 'react';
import { X, Cpu, Terminal, CheckCircle2, AlertTriangle, Code, Layers } from 'lucide-react';

export default function AgentDetailModal({ agent, status, output, onClose }) {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl glow-cyan space-y-0">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide">
                {agent.name}
              </h3>
              <p className="text-xs text-cyan-400/90 font-mono">
                ID: {agent.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Agent Role / Description */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Agent Functional Role
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {agent.role}
            </p>
          </div>

          {/* Execution Status */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Execution Status:</span>
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
              {status || 'READY'}
            </span>
          </div>

          {/* Agent Output Data JSON */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>AGENT OUTPUT DATA PAYLOAD</span>
            </div>

            <div className="p-4 rounded-xl bg-[#060810] border border-slate-800 text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-60">
              {output && Object.keys(output).length > 0 ? (
                <pre>{JSON.stringify(output, null, 2)}</pre>
              ) : (
                <p className="text-slate-500 italic">No output recorded yet. Run assessment to populate real agent results.</p>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors"
          >
            CLOSE WINDOW
          </button>
        </div>

      </div>
    </div>
  );
}
