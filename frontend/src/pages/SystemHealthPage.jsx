import React from 'react';
import SystemHealthCard from '../components/SystemHealthCard';
import { HeartPulse } from 'lucide-react';

export default function SystemHealthPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <HeartPulse className="w-6 h-6 text-emerald-400" />
          <span>SYSTEM HEALTH & DIAGNOSTICS</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Backend API connectivity, ML models status, and FAISS database diagnostics
        </p>
      </div>

      <SystemHealthCard />
    </div>
  );
}
