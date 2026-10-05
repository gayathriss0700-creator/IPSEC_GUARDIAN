import React from 'react';
import SecurityReportCard from '../components/SecurityReportCard';
import { FileText } from 'lucide-react';

export default function ReportsPage({ assessmentResult }) {
  const assessment = assessmentResult?.assessment;
  const reportData = assessmentResult?.agents?.report;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <FileText className="w-6 h-6 text-cyan-400" />
          <span>EXECUTIVE SECURITY REPORTS</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Consolidated cybersecurity report compilation and export center
        </p>
      </div>

      <SecurityReportCard assessment={assessment} reportData={reportData} />
    </div>
  );
}
