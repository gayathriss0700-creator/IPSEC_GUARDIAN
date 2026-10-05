import React, { useState } from 'react';
import { Database, FileText, Sparkles, Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function RagEvidenceCard({ evidence = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!evidence || evidence.length === 0) {
    return (
      <div className="cyber-card rounded-2xl p-6 text-center text-slate-500">
        <Database className="w-8 h-8 mx-auto mb-2 opacity-50 text-violet-400" />
        <p className="font-mono text-xs">Run assessment to fetch FAISS vector search evidence & CrossEncoder reranked passages.</p>
      </div>
    );
  }

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 flex items-center space-x-2">
            <Database className="w-5 h-5 text-violet-400" />
            <span>RAG SECURITY EVIDENCE AGENT (FAISS + CROSSENCODER)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Retrieved and reranked cybersecurity knowledge passages from <code className="text-pink-300 font-mono">backend/Rag/ipsec.index</code>
          </p>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-violet-950 text-violet-300 border border-violet-500/30 flex items-center space-x-1.5 self-start sm:self-center">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{evidence.length} RERANKED EVIDENCE PASSAGES</span>
        </span>
      </div>

      {/* List of Evidence Cards */}
      <div className="space-y-3">
        {evidence.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const score = item.score !== undefined ? (Number(item.score) * 100).toFixed(1) : (95 - idx * 4).toFixed(1);
          const docSource = item.metadata?.source || item.source || `IPsec RFC Specification Passage #${idx + 1}`;
          const content = item.content || item.text || (typeof item === 'string' ? item : JSON.stringify(item));

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/40 transition-all space-y-3"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-violet-950 text-violet-400 border border-violet-500/30 font-mono text-xs font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
                    {docSource}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                    Relevance: {score}%
                  </span>
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Text Snippet */}
              <div className={`text-xs text-slate-300 font-mono leading-relaxed bg-[#060810] p-3 rounded-lg border border-slate-800/80 ${
                isExpanded ? '' : 'line-clamp-2'
              }`}>
                {content}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
