import React from 'react';
import SecurityScoreHero from '../components/SecurityScoreHero';
import AgentPipeline from '../components/AgentPipeline';
import ThreatIntelligenceCard from '../components/ThreatIntelligenceCard';
import VulnerabilityCard from '../components/VulnerabilityCard';
import ComplianceCard from '../components/ComplianceCard';
import { Shield, Activity, AlertTriangle, CheckSquare, Sparkles, ArrowRight, Play } from 'lucide-react';

export default function CommandCenter({ assessmentResult, agentStatuses, isAssessing, onNavigate, onAgentClick }) {
  const assessment = assessmentResult?.assessment || {};
  const agents = assessmentResult?.agents || {};
  const evidence = assessmentResult?.evidence || [];
  const recommendations = assessmentResult?.recommendations || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Security Posture Score */}
      <SecurityScoreHero
        score={assessment.score}
        riskLevel={assessment.risk_level}
        verdict={assessment.verdict}
        summary={assessment.summary}
        confidence={assessment.confidence}
        onRunAssessmentClick={() => onNavigate('assessment')}
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Config Score */}
        <div 
          onClick={() => onNavigate('assessment')}
          className="cyber-card rounded-xl p-4 cursor-pointer hover:border-cyan-400/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              IPsec Config Score
            </span>
            <Shield className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">
            {agents.configuration?.score !== undefined ? `${agents.configuration.score}/100` : '--'}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            {agents.configuration?.status === 'COMPLETED' ? 'Rule Evaluation Complete' : 'Awaiting Assessment'}
          </p>
        </div>

        {/* Metric 2: Threat ML */}
        <div 
          onClick={() => onNavigate('threat-intel')}
          className="cyber-card rounded-xl p-4 cursor-pointer hover:border-emerald-400/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              Threat Detection ML
            </span>
            <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-2">
            {agents.threat_detection?.prediction || 'BENIGN'}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            Random Forest Anomaly Classifier
          </p>
        </div>

        {/* Metric 3: Vulnerabilities */}
        <div 
          onClick={() => onNavigate('vulnerabilities')}
          className="cyber-card rounded-xl p-4 cursor-pointer hover:border-amber-400/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              Identified Flaws
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-2">
            {agents.vulnerability?.vulnerabilities?.length ?? 0} FINDINGS
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            Severity Ranked Weaknesses
          </p>
        </div>

        {/* Metric 4: Compliance */}
        <div 
          onClick={() => onNavigate('compliance')}
          className="cyber-card rounded-xl p-4 cursor-pointer hover:border-blue-400/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              Compliance Audit
            </span>
            <CheckSquare className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400 mt-2">
            {agents.compliance?.compliance_status || 'PASS'}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
            NIST / CNSA / STIG Baselines
          </p>
        </div>

      </div>

      {/* 10-Agent Pipeline Visualization */}
      <AgentPipeline
        agentStatuses={agentStatuses}
        agentOutputs={agents}
        onAgentClick={onAgentClick}
      />

      {/* Bottom Summary Highlights Grid */}
      {assessmentResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatIntelligenceCard threatData={agents.threat_detection} />
          <ComplianceCard complianceData={agents.compliance} />
        </div>
      )}

    </div>
  );
}
