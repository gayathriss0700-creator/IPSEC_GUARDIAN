import React, { useState } from 'react';
import { 
  Sliders, 
  Activity, 
  Database, 
  ShieldAlert, 
  CheckSquare, 
  FlaskConical, 
  Bot, 
  Wrench, 
  FileText, 
  Layers,
  CheckCircle2,
  Clock,
  AlertOctagon,
  MinusCircle,
  ChevronRight,
  Info
} from 'lucide-react';

export default function AgentPipeline({ agentStatuses = {}, agentOutputs = {}, onAgentClick }) {
  
  const agents = [
    {
      id: 'orchestrator',
      name: 'Agent Orchestrator',
      role: 'Pipeline Controller & Workflow Coordinator',
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/50',
    },
    {
      id: 'configuration_agent',
      name: 'IPsec Configuration Agent',
      role: 'Deterministic Rule & Cipher Suite Evaluation',
      icon: Sliders,
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/50',
    },
    {
      id: 'threat_detection_agent',
      name: 'Threat Detection Agent',
      role: 'Random Forest ML NetFlow Anomaly Classification',
      icon: Activity,
      color: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500/50',
    },
    {
      id: 'rag_agent',
      name: 'RAG Security Evidence Agent',
      role: 'FAISS Vector Search & CrossEncoder Reranking',
      icon: Database,
      color: 'from-violet-500 to-purple-600',
      borderColor: 'border-violet-500/50',
    },
    {
      id: 'vulnerability_agent',
      name: 'Vulnerability Analysis Agent',
      role: 'Security Control Weaknesses & Severity Ranker',
      icon: ShieldAlert,
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500/50',
    },
    {
      id: 'compliance_agent',
      name: 'Compliance Agent',
      role: 'NIST SP 800-77, CNSA 1.0 & DoD STIG Audits',
      icon: CheckSquare,
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-cyan-500/50',
    },
    {
      id: 'attack_simulation_agent',
      name: 'Attack Simulation Agent',
      role: 'Safe Configuration What-If Impact Simulator',
      icon: FlaskConical,
      color: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-500/50',
    },
    {
      id: 'reasoning_agent',
      name: 'Qwen3-14B Reasoning Agent',
      role: 'Evidence-Grounded Cybersecurity LLM Reasoning',
      icon: Bot,
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-pink-500/50',
    },
    {
      id: 'remediation_agent',
      name: 'Remediation Agent',
      role: 'Prioritized Actionable Technical Guidance',
      icon: Wrench,
      color: 'from-teal-500 to-emerald-600',
      borderColor: 'border-teal-500/50',
    },
    {
      id: 'report_agent',
      name: 'Security Report Agent',
      role: 'Executive Summary & Markdown Compiler',
      icon: FileText,
      color: 'from-slate-600 to-cyan-700',
      borderColor: 'border-cyan-500/50',
    }
  ];

  const getStatusBadge = (status) => {
    const s = (status || 'READY').toUpperCase();
    switch (s) {
      case 'RUNNING':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center space-x-1 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>RUNNING</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>COMPLETED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-950 text-rose-400 border border-rose-500/40 flex items-center space-x-1">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            <span>FAILED</span>
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-900 text-slate-400 border border-slate-700 flex items-center space-x-1">
            <MinusCircle className="w-3 h-3 text-slate-400" />
            <span>SKIPPED</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>READY</span>
          </span>
        );
    }
  };

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>10-AGENT EXECUTION PIPELINE</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-agent cybersecurity reasoning graph & execution state topology
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Interactive Node Workflow</span>
        </div>
      </div>

      {/* Grid of Agent Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const status = agentStatuses[agent.id] || 'READY';
          const isRunning = status === 'RUNNING';
          const isCompleted = status === 'COMPLETED';
          const isFailed = status === 'FAILED';
          const output = agentOutputs[agent.id] || {};

          return (
            <div
              key={agent.id}
              onClick={() => onAgentClick && onAgentClick(agent, status, output)}
              className={`
                relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between
                ${isRunning ? 'bg-cyan-950/40 border-cyan-400 glow-cyan animate-pulse' : ''}
                ${isCompleted ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-400/60' : ''}
                ${isFailed ? 'bg-rose-950/30 border-rose-500/50 hover:border-rose-400' : ''}
                ${!isRunning && !isCompleted && !isFailed ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : ''}
              `}
            >
              {/* Top Row: Index & Status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  NODE #{String(index + 1).padStart(2, '0')}
                </span>
                {getStatusBadge(status)}
              </div>

              {/* Agent Icon & Name */}
              <div className="space-y-2 mb-4">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${agent.color} p-2 flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {agent.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {agent.role}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Result Summary */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="truncate max-w-[120px]">
                  {isCompleted && output.score !== undefined ? `Score: ${output.score}/100` : ''}
                  {isCompleted && output.prediction ? `ML: ${output.prediction}` : ''}
                  {isCompleted && output.compliance_status ? `Audit: ${output.compliance_status}` : ''}
                  {!isCompleted && 'Click for specs'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
