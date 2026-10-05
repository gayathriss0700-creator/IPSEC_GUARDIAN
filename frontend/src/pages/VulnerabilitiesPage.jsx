import React from 'react';
import VulnerabilityCard from '../components/VulnerabilityCard';
import { AlertTriangle } from 'lucide-react';

export default function VulnerabilitiesPage({ assessmentResult }) {
  const vulns = assessmentResult?.agents?.vulnerability?.vulnerabilities || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <span>VULNERABILITY MANAGEMENT CENTER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Severity-categorized cryptographic weaknesses and security flaws
        </p>
      </div>

      <VulnerabilityCard vulnerabilities={vulns} />
    </div>
  );
}
