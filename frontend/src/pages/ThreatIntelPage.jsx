import React from 'react';
import ThreatIntelligenceCard from '../components/ThreatIntelligenceCard';
import { Activity } from 'lucide-react';

export default function ThreatIntelPage({ assessmentResult }) {
  const threatData = assessmentResult?.agents?.threat_detection;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          <span>THREAT INTELLIGENCE & RANDOM FOREST ML</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Machine Learning netflow traffic anomaly classification & confidence scoring
        </p>
      </div>

      <ThreatIntelligenceCard threatData={threatData} />
    </div>
  );
}
