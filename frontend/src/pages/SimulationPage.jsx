import React from 'react';
import WhatIfSimulationLab from '../components/WhatIfSimulationLab';
import { FlaskConical } from 'lucide-react';

export default function SimulationPage({ assessmentResult }) {
  const currentConfig = assessmentResult?.agents?.configuration?.configuration;
  const simData = assessmentResult?.agents?.attack_simulation;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <FlaskConical className="w-6 h-6 text-pink-400" />
          <span>SECURITY WHAT-IF SIMULATION LAB</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Simulate configuration parameter modifications and measure security posture score delta
        </p>
      </div>

      <WhatIfSimulationLab
        currentConfig={currentConfig}
        simulationData={simData}
      />
    </div>
  );
}
