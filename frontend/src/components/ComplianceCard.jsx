import React from 'react';
import { CheckSquare, ShieldCheck, ShieldAlert, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';

export default function ComplianceCard({ complianceData }) {
  if (!complianceData) {
    return (
      <div className="cyber-card rounded-2xl p-6 text-center text-slate-500">
        <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-400" />
        <p className="font-mono text-xs">Run assessment to perform NIST SP 800-77, CNSA 1.0, and DoD STIG compliance audits.</p>
      </div>
    );
  }

  const overallStatus = (complianceData.compliance_status || 'PASS').toUpperCase();

  const getStatusBadge = (status) => {
    const s = (status || 'PASS').toUpperCase();
    if (s === 'PASS') {
      return (
        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>COMPLIANT (PASS)</span>
        </span>
      );
    }
    if (s === 'PARTIAL') {
      return (
        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center space-x-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>PARTIAL COMPLIANCE</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center space-x-1.5">
        <ShieldAlert className="w-4 h-4 text-rose-400" />
        <span>NON-COMPLIANT (FAIL)</span>
      </span>
    );
  };

  const frameworks = complianceData.frameworks || {
    'NIST SP 800-77 r1': { status: overallStatus, notes: 'Guide to IPsec VPN Security Controls' },
    'NSA CNSA 1.0': { status: overallStatus, notes: 'Commercial National Security Algorithm Suite' },
    'DoD STIG VPN': { status: overallStatus, notes: 'Department of Defense Security Technical Implementation Guide' },
  };

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <span>COMPLIANCE AGENT (NIST / CNSA / STIG)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standard compliance audit against federal security baselines and cryptographic directives
          </p>
        </div>

        {getStatusBadge(overallStatus)}
      </div>

      {/* Framework Audits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(frameworks).map(([fwName, fwInfo]) => {
          const fwStatus = (fwInfo.status || overallStatus).toUpperCase();
          const isPass = fwStatus === 'PASS';
          const isPartial = fwStatus === 'PARTIAL';

          return (
            <div
              key={fwName}
              className={`p-5 rounded-xl border space-y-3 ${
                isPass
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isPartial
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-rose-950/20 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileCheck className={`w-5 h-5 ${isPass ? 'text-emerald-400' : isPartial ? 'text-amber-400' : 'text-rose-400'}`} />
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                  isPass
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : isPartial
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-rose-950 text-rose-300 border-rose-500/40'
                }`}>
                  {fwStatus}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono text-white tracking-wide">
                  {fwName}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {fwInfo.notes || fwInfo.finding || 'Compliance check completed.'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isPass ? 'bg-emerald-400' : isPartial ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: isPass ? '100%' : isPartial ? '60%' : '30%' }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
