import React from 'react';
import ComplianceCard from '../components/ComplianceCard';
import { CheckSquare } from 'lucide-react';

export default function CompliancePage({ assessmentResult }) {
  const complianceData = assessmentResult?.agents?.compliance;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <CheckSquare className="w-6 h-6 text-blue-400" />
          <span>FEDERAL COMPLIANCE AUDIT CENTER</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          NIST SP 800-77 r1, NSA CNSA 1.0, and DoD STIG VPN Security Baselines
        </p>
      </div>

      <ComplianceCard complianceData={complianceData} />
    </div>
  );
}
