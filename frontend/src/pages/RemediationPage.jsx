import React from 'react';
import RemediationPanel from '../components/RemediationPanel';
import { Wrench } from 'lucide-react';

export default function RemediationPage({ assessmentResult }) {
  const recommendations = assessmentResult?.recommendations || assessmentResult?.agents?.remediation?.recommendations || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <Wrench className="w-6 h-6 text-teal-400" />
          <span>REMEDIATION & HARDENING CENTER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Prioritized step-by-step guidance for fixing security flaws and strengthening IPsec parameters
        </p>
      </div>

      <RemediationPanel recommendations={recommendations} />
    </div>
  );
}
