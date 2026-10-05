import React from 'react';
import AssessmentForm from '../components/AssessmentForm';
import SecurityScoreHero from '../components/SecurityScoreHero';
import AgentPipeline from '../components/AgentPipeline';
import ThreatIntelligenceCard from '../components/ThreatIntelligenceCard';
import RagEvidenceCard from '../components/RagEvidenceCard';
import VulnerabilityCard from '../components/VulnerabilityCard';
import ComplianceCard from '../components/ComplianceCard';
import WhatIfSimulationLab from '../components/WhatIfSimulationLab';
import AISecurityAnalystConsole from '../components/AISecurityAnalystConsole';
import RemediationPanel from '../components/RemediationPanel';
import SecurityReportCard from '../components/SecurityReportCard';
import { Sliders, Activity, ShieldCheck, Database, CheckSquare, Wrench, FileText } from 'lucide-react';

export default function SecurityAssessmentPage({
  onSubmitAssessment,
  isAssessing,
  assessmentResult,
  agentStatuses,
  onAgentClick,
}) {
  const assessment = assessmentResult?.assessment || {};
  const agents = assessmentResult?.agents || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-cyan-400" />
          <span>IPSEC SECURITY ASSESSMENT WORKFLOW</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure security parameters and run the complete 10-agent multi-agent reasoning evaluation
        </p>
      </div>

      {/* Form Section */}
      <AssessmentForm
        onSubmitAssessment={onSubmitAssessment}
        isAssessing={isAssessing}
      />

      {/* Live Execution Pipeline Status */}
      <AgentPipeline
        agentStatuses={agentStatuses}
        agentOutputs={agents}
        onAgentClick={onAgentClick}
      />

      {/* Assessment Results Section */}
      {assessmentResult && (
        <div className="space-y-8 pt-4 border-t border-slate-800">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-mono text-cyan-400 tracking-wider">
              MULTI-AGENT EVALUATION RESULTS & EVIDENCE
            </h3>
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
              EVALUATION COMPLETE
            </span>
          </div>

          <SecurityScoreHero
            score={assessment.score}
            riskLevel={assessment.risk_level}
            verdict={assessment.verdict}
            summary={assessment.summary}
            confidence={assessment.confidence}
          />

          {/* Configuration Parameters Breakdown */}
          {agents.configuration && (
            <div className="cyber-card rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>Configuration Analysis Findings</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(agents.configuration.configuration || {}).map(([param, val]) => (
                  <div key={param} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase">{param}:</span>
                    <span className="text-cyan-300 font-bold">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threat Intelligence ML */}
          <ThreatIntelligenceCard threatData={agents.threat_detection} />

          {/* RAG Security Evidence */}
          <RagEvidenceCard evidence={assessmentResult.evidence} />

          {/* Vulnerability Center */}
          <VulnerabilityCard vulnerabilities={agents.vulnerability?.vulnerabilities} />

          {/* Compliance Audit */}
          <ComplianceCard complianceData={agents.compliance} />

          {/* What-If Simulation */}
          <WhatIfSimulationLab simulationData={agents.attack_simulation} />

          {/* Qwen Reasoning */}
          <AISecurityAnalystConsole currentConfig={agents.configuration?.configuration} />

          {/* Remediation Panel */}
          <RemediationPanel recommendations={assessmentResult.recommendations} />

          {/* Security Report */}
          <SecurityReportCard assessment={assessment} reportData={agents.report} />

        </div>
      )}

    </div>
  );
}
