import React from 'react';
import { FileText, Download, Printer, ShieldCheck, Award, Layers } from 'lucide-react';

export default function SecurityReportCard({ reportData, assessment }) {
  const summaryText = assessment?.report_text || assessment?.summary || reportData?.report_text || 'Run an assessment to compile executive report.';
  const score = assessment?.score ?? 100;
  const verdict = assessment?.verdict || assessment?.risk_level || 'LOW RISK';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>EXECUTIVE SECURITY REPORT AGENT</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated multi-agent cybersecurity audit report & executive summary
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-900/60 transition-all flex items-center space-x-2"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT / EXPORT REPORT</span>
        </button>
      </div>

      {/* Summary Score Header */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            EVALUATION VERDICT
          </span>
          <span className="text-xl font-bold font-mono text-white">
            {verdict}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            FINAL SECURITY POSTURE SCORE
          </span>
          <span className="text-2xl font-black font-mono text-cyan-400">
            {score}/100
          </span>
        </div>
      </div>

      {/* Report Markdown Text Content */}
      <div className="p-6 rounded-xl bg-[#060810] border border-slate-800 space-y-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
        {summaryText}
      </div>

    </div>
  );
}
