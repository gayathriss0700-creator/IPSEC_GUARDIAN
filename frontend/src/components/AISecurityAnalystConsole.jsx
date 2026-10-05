import React, { useState } from 'react';
import { Bot, Send, Sparkles, Database, Terminal, Shield, RefreshCw, User } from 'lucide-react';
import { apiService } from '../services/api';

export default function AISecurityAnalystConsole({ currentConfig }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings. I am the IPsec Guardian AI Security Analyst powered by Qwen3-14B, grounded by FAISS vector search and CrossEncoder reranking. Ask me any technical query regarding IPsec parameters, RFC standards, or threat vulnerabilities.',
      evidence: [],
    },
  ]);

  const handleSend = async (queryText) => {
    const q = queryText || question;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await apiService.askQuestion(q, currentConfig || {});
      const aiMsg = {
        sender: 'ai',
        text: res.answer || res.reasoning_output || 'Analysis completed based on evidence context.',
        evidence: res.evidence || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `Error processing security query: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (text) => {
    setQuestion(text);
    handleSend(text);
  };

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6 flex flex-col h-[700px]">
      
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-magenta-950/80 border border-pink-500/40 flex items-center justify-center text-pink-400 glow-magenta">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
              AI SECURITY ANALYST (QWEN3-14B)
            </h3>
            <p className="text-xs text-slate-400">
              Evidence-grounded cybersecurity reasoning engine
            </p>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-pink-950 text-pink-300 border border-pink-500/30 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>QWEN3-14B REASONING</span>
        </span>
      </div>

      {/* Preset Question Suggestions */}
      <div className="flex flex-wrap gap-2 shrink-0">
        <span className="text-[10px] font-mono text-slate-400 py-1 uppercase">Prompts:</span>
        <button
          onClick={() => handlePreset('Why is PFS important in IKEv2?')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          Why is PFS important in IKEv2?
        </button>
        <button
          onClick={() => handlePreset('What are the security risks of 3DES encryption?')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          Risks of 3DES encryption?
        </button>
        <button
          onClick={() => handlePreset('How does Anti-Replay protection prevent attack replay?')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
        >
          How Anti-Replay works?
        </button>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isUser 
                  ? 'bg-cyan-950 border-cyan-500/40 text-cyan-400' 
                  : 'bg-pink-950 border-pink-500/40 text-pink-400'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-xl border max-w-2xl space-y-3 ${
                isUser
                  ? 'bg-cyan-950/40 border-cyan-500/30 text-slate-100'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </p>

                {/* Evidence Grounding */}
                {msg.evidence && msg.evidence.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-violet-400 uppercase flex items-center space-x-1">
                      <Database className="w-3 h-3" />
                      <span>Retrieved FAISS Security Evidence:</span>
                    </span>

                    <div className="space-y-1.5">
                      {msg.evidence.slice(0, 2).map((ev, i) => (
                        <div key={i} className="p-2 rounded bg-[#060810] border border-slate-800 text-[11px] text-slate-400 line-clamp-2">
                          {typeof ev === 'string' ? ev : ev.content || ev.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3 text-pink-400 font-mono text-xs p-2">
            <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
            <span>Qwen3-14B Reasoning & FAISS Reranking in progress...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 pt-3 border-t border-slate-800 shrink-0"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask AI Security Analyst..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-pink-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-2 shadow-lg glow-magenta"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">ASK QWEN</span>
        </button>
      </form>

    </div>
  );
}
