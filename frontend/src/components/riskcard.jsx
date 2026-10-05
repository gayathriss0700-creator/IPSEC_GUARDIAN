import React from 'react';

export default function RiskCard({ assessment }) {
  if (!assessment) return null;
  
  const getConfidenceBadge = (conf) => {
    if (!conf) return 'text-gray-400 bg-gray-800 border-gray-700';
    const lower = conf.toLowerCase();
    if (lower.includes('high')) return 'text-green-400 bg-green-900/30 border-green-700/50';
    if (lower.includes('medium')) return 'text-yellow-400 bg-yellow-900/30 border-yellow-700/50';
    return 'text-red-400 bg-red-900/30 border-red-700/50';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-red-400 border-b border-gray-700 pb-2 flex items-center justify-between">
        <span>Risk & Recommendation</span>
        {assessment.confidence && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getConfidenceBadge(assessment.confidence)}`}>
            {assessment.confidence.split(' ')[0]}
          </span>
        )}
      </h3>
      <div className="space-y-4">
        {assessment.risk && (
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-800/30">
            <h4 className="font-semibold text-red-300 text-xs uppercase tracking-wider mb-1">Identified Security Risk</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{assessment.risk}</p>
          </div>
        )}
        
        {assessment.recommendation && (
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
            <h4 className="font-semibold text-blue-300 text-xs uppercase tracking-wider mb-1">Evidence-Based Recommendation</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{assessment.recommendation}</p>
          </div>
        )}

        {assessment.what_if && (
          <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
            <h4 className="font-semibold text-purple-300 text-xs uppercase tracking-wider mb-1">What-If Analysis</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{assessment.what_if}</p>
          </div>
        )}
      </div>
    </div>
  );
}
