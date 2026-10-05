import React from 'react';
import AISecurityAnalystConsole from '../components/AISecurityAnalystConsole';
import { Bot } from 'lucide-react';

export default function AIAnalystPage({ assessmentResult }) {
  const currentConfig = assessmentResult?.agents?.configuration?.configuration;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center space-x-2">
          <Bot className="w-6 h-6 text-pink-400" />
          <span>QWEN3-14B AI SECURITY ANALYST</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Evidence-grounded cybersecurity reasoning console powered by Qwen3-14B & FAISS RAG
        </p>
      </div>

      <AISecurityAnalystConsole currentConfig={currentConfig} />
    </div>
  );
}
