import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AgentDetailModal from './components/AgentDetailModal';

// Pages
import CommandCenter from './pages/CommandCenter';
import SecurityAssessmentPage from './pages/SecurityAssessmentPage';
import AgentNetworkPage from './pages/AgentNetworkPage';
import ThreatIntelPage from './pages/ThreatIntelPage';
import RagEvidencePage from './pages/RagEvidencePage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import CompliancePage from './pages/CompliancePage';
import SimulationPage from './pages/SimulationPage';
import AIAnalystPage from './pages/AIAnalystPage';
import RemediationPage from './pages/RemediationPage';
import ReportsPage from './pages/ReportsPage';
import SystemHealthPage from './pages/SystemHealthPage';

import { apiService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('command-center');
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [agentStatuses, setAgentStatuses] = useState({
    orchestrator: 'READY',
    configuration_agent: 'READY',
    threat_detection_agent: 'READY',
    rag_agent: 'READY',
    vulnerability_agent: 'READY',
    compliance_agent: 'READY',
    attack_simulation_agent: 'READY',
    reasoning_agent: 'READY',
    remediation_agent: 'READY',
    report_agent: 'READY',
  });
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Run full security assessment
  const handleRunAssessment = async (payload) => {
    setIsAssessing(true);
    setErrorMessage(null);

    // Simulate progressive agent status updates for visual feedback
    const agentSequence = [
      'configuration_agent',
      'threat_detection_agent',
      'rag_agent',
      'vulnerability_agent',
      'compliance_agent',
      'attack_simulation_agent',
      'reasoning_agent',
      'remediation_agent',
      'report_agent',
    ];

    // Mark orchestrator running
    setAgentStatuses((prev) => ({ ...prev, orchestrator: 'RUNNING' }));

    try {
      // Execute backend API
      const result = await apiService.runAssessment(payload);

      setAssessmentResult(result);
      if (result.agent_statuses) {
        setAgentStatuses(result.agent_statuses);
      }
    } catch (err) {
      console.error('[Assessment Error]', err);
      setErrorMessage(err.message || 'Multi-agent assessment failed. Ensure backend API is running on http://localhost:8000.');
      setAgentStatuses((prev) => ({ ...prev, orchestrator: 'FAILED' }));
    } finally {
      setIsAssessing(false);
    }
  };

  const handleAgentClick = (agentObj, status, output) => {
    setSelectedAgent({
      agent: agentObj,
      status: status,
      output: output,
    });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'command-center':
        return (
          <CommandCenter
            assessmentResult={assessmentResult}
            agentStatuses={agentStatuses}
            isAssessing={isAssessing}
            onNavigate={setActiveTab}
            onAgentClick={handleAgentClick}
          />
        );
      case 'assessment':
        return (
          <SecurityAssessmentPage
            onSubmitAssessment={handleRunAssessment}
            isAssessing={isAssessing}
            assessmentResult={assessmentResult}
            agentStatuses={agentStatuses}
            onAgentClick={handleAgentClick}
          />
        );
      case 'agent-network':
        return (
          <AgentNetworkPage
            agentStatuses={agentStatuses}
            agentOutputs={assessmentResult?.agents}
            onAgentClick={handleAgentClick}
          />
        );
      case 'threat-intel':
        return <ThreatIntelPage assessmentResult={assessmentResult} />;
      case 'vulnerabilities':
        return <VulnerabilitiesPage assessmentResult={assessmentResult} />;
      case 'compliance':
        return <CompliancePage assessmentResult={assessmentResult} />;
      case 'simulation':
        return <SimulationPage assessmentResult={assessmentResult} />;
      case 'ai-analyst':
        return <AIAnalystPage assessmentResult={assessmentResult} />;
      case 'remediation':
        return <RemediationPage assessmentResult={assessmentResult} />;
      case 'reports':
        return <ReportsPage assessmentResult={assessmentResult} />;
      case 'health':
        return <SystemHealthPage />;
      default:
        return (
          <CommandCenter
            assessmentResult={assessmentResult}
            agentStatuses={agentStatuses}
            isAssessing={isAssessing}
            onNavigate={setActiveTab}
            onAgentClick={handleAgentClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header */}
      <Header isAssessing={isAssessing} />

      {/* Main Body Layout */}
      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content View Container */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center justify-between shadow-lg glow-rose">
              <span>⚠️ {errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white font-bold"
              >
                DISMISS
              </button>
            </div>
          )}

          {renderActivePage()}
        </main>
      </div>

      {/* Agent Node Inspection Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent.agent}
          status={selectedAgent.status}
          output={selectedAgent.output}
          onClose={() => setSelectedAgent(null)}
        />
      )}

    </div>
  );
}
