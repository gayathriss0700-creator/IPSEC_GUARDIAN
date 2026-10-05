import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 text-center">
        <div className="inline-block p-4 bg-blue-600/10 rounded-full border border-blue-500/20 mb-4">
          <span className="text-5xl">🛡️</span>
        </div>
        <h2 className="text-4xl font-extrabold text-blue-400 mb-4 tracking-tight">IPsec Guardian</h2>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
          An Evidence-Grounded Cybersecurity Reasoning LLM System for IPsec Security Assessment.
          Combines Random Forest Traffic ML, Grounded FAISS RAG Retrieval, CrossEncoder Reranking, and Qwen3-14B Reasoning.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="text-blue-400 text-3xl mb-3">📊</div>
            <h3 className="text-base font-bold text-white mb-2">Network Traffic ML</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Trained Random Forest classifier evaluates 8 netflow parameters (ports, protocol, flow duration, packet count, bytes).</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="text-purple-400 text-3xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-white mb-2">Hybrid RAG V2</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Multi-query vector search with SentenceTransformers (384-d), lexical weighting, and CrossEncoder reranking.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-colors">
            <div className="text-green-400 text-3xl mb-3">🧠</div>
            <h3 className="text-base font-bold text-white mb-2">Strict Qwen3-14B</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Strict claim grounding gate suppresses unsupported technical claims and enforces strict evidence attribution.</p>
          </div>
        </div>

        <Link 
          to="/assistance" 
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          Start Security Assessment →
        </Link>
      </div>
    </div>
  );
}
