import React, { useState, useEffect } from 'react';
import AgentPipeline from '../components/AgentPipeline';
import { Network, RefreshCw, Cpu, Layers } from 'lucide-react';
import { apiService } from '../services/api';

export default function AgentNetworkPage({ agentStatuses = {}, agentOutputs = {}, onAgentClick }) {
  const [agents, setAgents] = useState([]);
  const [liveStatuses, setLiveStatuses] = useState(agentStatuses);
  const [loading, setLoading] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAgents();
      setAgents(data.agents || []);
      setLiveStatuses(data.statuses || agentStatuses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <span>10-AGENT NETWORK TOPOLOGY & LIVE MONITOR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status monitoring & inspection across all autonomous cybersecurity agents
          </p>
        </div>

        <button
          onClick={fetchAgents}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 font-bold transition-all flex items-center space-x-2 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH AGENT STATUS</span>
        </button>
      </div>

      <AgentPipeline
        agentStatuses={liveStatuses}
        agentOutputs={agentOutputs}
        onAgentClick={onAgentClick}
      />

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((ag) => {
          const st = liveStatuses[ag.id] || 'READY';

          return (
            <div
              key={ag.id}
              onClick={() => onAgentClick && onAgentClick(ag, st, agentOutputs[ag.id] || {})}
              className="cyber-card rounded-xl p-5 space-y-3 cursor-pointer hover:border-cyan-400/60 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {ag.id}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-900 text-slate-300 border border-slate-700 uppercase">
                  {st}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold font-mono text-white">
                  {ag.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ag.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
