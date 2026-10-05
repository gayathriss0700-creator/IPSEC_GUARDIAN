import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame, Award, CheckCircle } from 'lucide-react';

export default function SecurityScoreHero({ score, riskLevel, verdict, summary, confidence, onRunAssessmentClick }) {
  // If no score is provided yet
  const hasData = score !== undefined && score !== null;
  const numericScore = hasData ? Math.round(Number(score)) : 100;

  // Determine color theme based on Risk Level / Score
  const getRiskConfig = (level, scoreVal) => {
    const l = (level || '').toUpperCase();
    if (l === 'CRITICAL' || scoreVal < 50) {
      return {
        label: 'CRITICAL RISK',
        color: 'text-rose-500',
        stroke: '#f43f5e',
        bg: 'from-rose-950/40 to-pink-950/20',
        border: 'border-rose-500/40',
        glow: 'glow-rose',
        icon: Flame,
      };
    }
    if (l === 'HIGH' || scoreVal < 70) {
      return {
        label: 'HIGH RISK',
        color: 'text-amber-500',
        stroke: '#f59e0b',
        bg: 'from-amber-950/40 to-orange-950/20',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        icon: ShieldAlert,
      };
    }
    if (l === 'MEDIUM' || scoreVal < 85) {
      return {
        label: 'MEDIUM RISK',
        color: 'text-cyan-400',
        stroke: '#06b6d4',
        bg: 'from-cyan-950/40 to-blue-950/20',
        border: 'border-cyan-500/40',
        glow: 'glow-cyan',
        icon: AlertTriangle,
      };
    }
    return {
      label: 'LOW RISK',
      color: 'text-emerald-400',
      stroke: '#10b981',
      bg: 'from-emerald-950/40 to-teal-950/20',
      border: 'border-emerald-500/40',
      glow: 'glow-emerald',
      icon: ShieldCheck,
    };
  };

  const riskConfig = getRiskConfig(riskLevel, numericScore);
  const RiskIcon = riskConfig.icon;

  // SVG Radial Gauge Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;

  return (
    <div className={`cyber-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br ${riskConfig.bg} border ${riskConfig.border}`}>
      
      {/* Background Grid & Ambient Glow */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Radial Gauge Visualizer */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-48 h-48 flex items-center justify-center">
            
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Dynamic Value Arc */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke={riskConfig.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black font-mono tracking-tight text-white drop-shadow-md">
                {hasData ? numericScore : '--'}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                / 100 SCORE
              </span>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border ${riskConfig.border} ${riskConfig.color} bg-slate-950/80 flex items-center space-x-1.5`}>
            <RiskIcon className="w-3.5 h-3.5" />
            <span>{hasData ? riskConfig.label : 'AWAITING EVALUATION'}</span>
          </div>
        </div>

        {/* Assessment Verdict & Details */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-1 text-[11px] font-mono font-semibold uppercase rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              SECURITY POSTURE STATUS
            </span>
            {confidence && (
              <span className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
                <Award className="w-3 h-3 text-cyan-400" />
                <span>{confidence}</span>
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-black font-mono tracking-wide text-white">
              {verdict || (hasData ? 'IPsec Security Evaluation Complete' : 'Run Full IPsec Assessment')}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
              {summary || (hasData 
                ? 'Evaluation results generated across 10 security agents incorporating deterministic rules, ML network traffic models, and FAISS evidence.'
                : 'Click "Run Security Assessment" to execute all 10 security agents, analyze IPsec parameters, run threat ML detection, and query Qwen3-14B.')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={onRunAssessmentClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold tracking-wider shadow-lg glow-cyan transition-all flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{hasData ? 'RUN NEW ASSESSMENT' : 'START ASSESSMENT NOW'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
