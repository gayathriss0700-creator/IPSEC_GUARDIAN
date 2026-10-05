import React, { useState } from 'react';
import { Wrench, CheckSquare, AlertTriangle, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function RemediationPanel({ recommendations = [] }) {
  const [completedItems, setCompletedItems] = useState({});

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="cyber-card rounded-2xl p-6 text-center text-slate-500">
        <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50 text-teal-400" />
        <p className="font-mono text-xs">Run assessment to generate prioritized technical remediation guidance.</p>
      </div>
    );
  }

  const toggleCheck = (idx) => {
    setCompletedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getPriorityStyle = (priority) => {
    const p = (priority || 'HIGH').toUpperCase();
    if (p === 'HIGH') return 'bg-rose-950 text-rose-300 border-rose-500/40';
    if (p === 'MEDIUM') return 'bg-amber-950 text-amber-300 border-amber-500/40';
    return 'bg-blue-950 text-blue-300 border-blue-500/40';
  };

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-teal-400" />
            <span>REMEDIATION AGENT (ACTIONABLE HARDENING)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized technical instructions & parameter configuration changes
          </p>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-teal-950 text-teal-300 border border-teal-500/30 flex items-center space-x-1.5">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{recommendations.length} ACTION ITEMS</span>
        </span>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        {recommendations.map((item, idx) => {
          const isDone = !!completedItems[idx];
          const prioStyle = getPriorityStyle(item.priority);

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border transition-all space-y-3 ${
                isDone
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-teal-500/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleCheck(idx)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-black'
                        : 'bg-slate-900 border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded border uppercase ${prioStyle}`}>
                        Priority: {item.priority || 'HIGH'}
                      </span>
                      {item.parameter && (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Target: {item.parameter}
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-bold font-mono text-white ${isDone ? 'line-through text-slate-500' : ''}`}>
                      {item.recommendation || item.action || `Remediation Item #${idx + 1}`}
                    </h4>
                  </div>
                </div>

              </div>

              {item.explanation && (
                <p className="text-xs text-slate-300 leading-relaxed font-sans pl-8">
                  {item.explanation}
                </p>
              )}

              {item.command_guidance && (
                <div className="ml-8 p-3 rounded-lg bg-[#060810] border border-slate-800 text-xs font-mono text-cyan-300">
                  <code>{item.command_guidance}</code>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
