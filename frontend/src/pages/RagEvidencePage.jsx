import React from 'react';
import RagEvidenceCard from '../components/RagEvidenceCard';
import { Database } from 'lucide-react';

export default function RagEvidencePage({ assessmentResult }) {
  const evidence = assessmentResult?.evidence || assessmentResult?.agents?.rag?.evidence || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <Database className="w-6 h-6 text-violet-400" />
          <span>RAG SECURITY EVIDENCE RETRIEVAL</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          FAISS vector search & CrossEncoder reranked security evidence passages
        </p>
      </div>

      <RagEvidenceCard evidence={evidence} />
    </div>
  );
}
