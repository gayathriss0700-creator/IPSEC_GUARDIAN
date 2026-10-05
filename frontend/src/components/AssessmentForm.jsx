import React, { useState } from 'react';
import { Sliders, Activity, HelpCircle, Play, ShieldAlert, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function AssessmentForm({ onSubmitAssessment, isAssessing }) {
  
  // Default IPsec Configuration Parameters
  const [config, setConfig] = useState({
    ike_version: 'IKEv2',
    encryption: 'AES-256-GCM',
    integrity: 'SHA-256',
    authentication: 'Certificate',
    dh_group: 'Strong group',
    pfs: 'Enabled',
    esp_mode: 'Tunnel',
    nat_t: 'Enabled',
    anti_replay: 'Enabled',
    traffic_selectors: 'Limited',
  });

  // Default NetFlow Traffic Parameters
  const [traffic, setTraffic] = useState({
    source_port: 50000,
    destination_port: 443,
    protocol: 6,
    duration: 2.0,
    packet_count: 50,
    bytes_sent: 5000,
    bytes_received: 7000,
    bytes_per_packet: 150.0,
  });

  // Question & Simulation
  const [question, setQuestion] = useState('Why is PFS important in IKEv2?');
  const [runSimulation, setRunSimulation] = useState(true);
  const [simulationScenario, setSimulationScenario] = useState('disable_pfs');

  const handleConfigChange = (key, val) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleTrafficChange = (key, val) => {
    setTraffic((prev) => ({ ...prev, [key]: Number(val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitAssessment({
      question,
      traffic,
      configuration: config,
      run_simulation: runSimulation,
      simulation_scenario: simulationScenario,
    });
  };

  const handleResetSecure = () => {
    setConfig({
      ike_version: 'IKEv2',
      encryption: 'AES-256-GCM',
      integrity: 'SHA-256',
      authentication: 'Certificate',
      dh_group: 'Strong group',
      pfs: 'Enabled',
      esp_mode: 'Tunnel',
      nat_t: 'Enabled',
      anti_replay: 'Enabled',
      traffic_selectors: 'Limited',
    });
  };

  const handleLoadVulnerable = () => {
    setConfig({
      ike_version: 'IKEv1',
      encryption: '3DES',
      integrity: 'MD5',
      authentication: 'Pre-shared key (PSK)',
      dh_group: 'Group 2',
      pfs: 'Disabled',
      esp_mode: 'Transport',
      nat_t: 'Disabled',
      anti_replay: 'Disabled',
      traffic_selectors: 'Any (0.0.0.0/0)',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="cyber-card rounded-2xl p-6 space-y-8">
      
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>IPSEC CONFIGURATION & TRAFFIC PARAMETERS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure target security parameters to execute real multi-agent evaluation
          </p>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetSecure}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold hover:bg-emerald-900/60 transition-colors flex items-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Preset: Secure</span>
          </button>
          <button
            type="button"
            onClick={handleLoadVulnerable}
            className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold hover:bg-rose-900/60 transition-colors flex items-center space-x-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Preset: Weak/Vulnerable</span>
          </button>
        </div>
      </div>

      {/* Section 1: IPsec Parameters */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center space-x-2">
          <Sliders className="w-4 h-4" />
          <span>1. IPsec Protocol & Security Suite</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* IKE Version */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">IKE Version</label>
            <select
              value={config.ike_version}
              onChange={(e) => handleConfigChange('ike_version', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="IKEv2">IKEv2 (Recommended)</option>
              <option value="IKEv1">IKEv1 (Legacy)</option>
            </select>
          </div>

          {/* Encryption */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Encryption</label>
            <select
              value={config.encryption}
              onChange={(e) => handleConfigChange('encryption', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="AES-256-GCM">AES-256-GCM</option>
              <option value="AES-256-CBC">AES-256-CBC</option>
              <option value="AES-128-CBC">AES-128-CBC</option>
              <option value="3DES">3DES (Weak)</option>
            </select>
          </div>

          {/* Integrity */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Integrity Algorithm</label>
            <select
              value={config.integrity}
              onChange={(e) => handleConfigChange('integrity', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="SHA-256">SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-1">SHA-1 (Legacy)</option>
              <option value="MD5">MD5 (Deprecated)</option>
            </select>
          </div>

          {/* Authentication */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Authentication</label>
            <select
              value={config.authentication}
              onChange={(e) => handleConfigChange('authentication', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Certificate">Digital Certificate (RSA/ECDSA)</option>
              <option value="Pre-shared key (PSK)">Pre-shared key (PSK)</option>
            </select>
          </div>

          {/* DH Group */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Diffie-Hellman Group</label>
            <select
              value={config.dh_group}
              onChange={(e) => handleConfigChange('dh_group', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Strong group">Strong Group (ECP256/384 / Group 19/20)</option>
              <option value="Group 14 (2048-bit MODP)">Group 14 (2048-bit MODP)</option>
              <option value="Group 5">Group 5 (1536-bit)</option>
              <option value="Group 2">Group 2 (1024-bit Weak)</option>
            </select>
          </div>

          {/* PFS */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">PFS (Perfect Forward Secrecy)</label>
            <select
              value={config.pfs}
              onChange={(e) => handleConfigChange('pfs', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          {/* ESP Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">ESP Mode</label>
            <select
              value={config.esp_mode}
              onChange={(e) => handleConfigChange('esp_mode', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Tunnel">Tunnel Mode (Site-to-Site/VPN)</option>
              <option value="Transport">Transport Mode</option>
            </select>
          </div>

          {/* NAT-T */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">NAT Traversal (NAT-T)</label>
            <select
              value={config.nat_t}
              onChange={(e) => handleConfigChange('nat_t', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          {/* Anti-Replay */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Anti-Replay Protection</label>
            <select
              value={config.anti_replay}
              onChange={(e) => handleConfigChange('anti_replay', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>

          {/* Traffic Selectors */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Traffic Selectors</label>
            <select
              value={config.traffic_selectors}
              onChange={(e) => handleConfigChange('traffic_selectors', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="Limited">Limited / Explicit Subnets</option>
              <option value="Any (0.0.0.0/0)">Any (0.0.0.0/0) Broad</option>
            </select>
          </div>

        </div>
      </div>

      {/* Section 2: Network Traffic Data */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>2. NetFlow Traffic Data (Random Forest ML Features)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Src Port</label>
            <input
              type="number"
              value={traffic.source_port}
              onChange={(e) => handleTrafficChange('source_port', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Dst Port</label>
            <input
              type="number"
              value={traffic.destination_port}
              onChange={(e) => handleTrafficChange('destination_port', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Protocol (6/17)</label>
            <input
              type="number"
              value={traffic.protocol}
              onChange={(e) => handleTrafficChange('protocol', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Duration (s)</label>
            <input
              type="number"
              step="0.1"
              value={traffic.duration}
              onChange={(e) => handleTrafficChange('duration', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Packets</label>
            <input
              type="number"
              value={traffic.packet_count}
              onChange={(e) => handleTrafficChange('packet_count', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Bytes Sent</label>
            <input
              type="number"
              value={traffic.bytes_sent}
              onChange={(e) => handleTrafficChange('bytes_sent', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Bytes Recv</label>
            <input
              type="number"
              value={traffic.bytes_received}
              onChange={(e) => handleTrafficChange('bytes_received', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Bytes/Pkt</label>
            <input
              type="number"
              step="1"
              value={traffic.bytes_per_packet}
              onChange={(e) => handleTrafficChange('bytes_per_packet', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Section 3: Security Question & What-If Simulation Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
        
        {/* Security Question */}
        <div className="lg:col-span-2 space-y-1.5">
          <label className="text-xs font-mono text-cyan-400 font-bold flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Security Assessment Question (for RAG & Qwen3-14B)</span>
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Why is Perfect Forward Secrecy crucial for IKEv2?"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Simulation Controls */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-purple-400 font-bold">Safe What-If Simulation</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={runSimulation}
                onChange={(e) => setRunSimulation(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <select
            disabled={!runSimulation}
            value={simulationScenario}
            onChange={(e) => setSimulationScenario(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono text-white focus:border-purple-400 focus:outline-none disabled:opacity-50"
          >
            <option value="disable_pfs">Scenario: Disable PFS</option>
            <option value="weak_encryption">Scenario: Downgrade to 3DES</option>
            <option value="no_anti_replay">Scenario: Disable Anti-Replay</option>
            <option value="broad_selectors">Scenario: Broad 0.0.0.0/0 Selectors</option>
          </select>
        </div>

      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isAssessing}
          className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-mono font-bold text-sm tracking-wider shadow-xl glow-cyan transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isAssessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>ORCHESTRATING 10 AGENTS...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>RUN MULTI-AGENT SECURITY ASSESSMENT</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
