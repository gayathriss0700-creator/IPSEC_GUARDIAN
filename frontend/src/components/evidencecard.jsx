import React from 'react';

export default function EvidenceCard({ evidence }) {
  if (!evidence || !evidence.length) return null;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 h-full overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-green-400 border-b border-gray-700 pb-2 flex items-center justify-between">
        <span>RERANKED EVIDENCE</span>
        <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/30">{evidence.length} Chunks</span>
      </h3>
      <div className="space-y-4">
        {evidence.map((item, idx) => (
          <div key={idx} className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
            <div className="flex justify-between items-start mb-2 gap-2">
              <h4 className="font-semibold text-blue-300 text-xs truncate" title={item.file}>{item.file}</h4>
              <span className="text-xs bg-gray-800 text-green-400 px-2 py-0.5 rounded border border-gray-700 whitespace-nowrap">
                Rerank: {item.rerank_score ? item.rerank_score.toFixed(3) : item.faiss_score?.toFixed(3)}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider font-mono">{item.section}</p>
            <p className="text-xs text-gray-300 leading-relaxed bg-gray-800/60 p-3 rounded border border-gray-700/50">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
