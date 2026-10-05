import React, { useState } from 'react';

export default function Chat({ messages, onSendMessage, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-400">Cybersecurity Reasoning Assistant</h2>
        <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">Qwen3-14B Grounded</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              
              {msg.assessment && (
                <div className="mt-4 space-y-3 border-t border-gray-600/50 pt-4">
                  {Object.entries(msg.assessment).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="bg-gray-800/60 p-3 rounded-lg border border-gray-600/40">
                        <strong className="block mb-1 text-xs text-blue-300 uppercase tracking-wider font-semibold">{key.replace('_', ' ')}:</strong>
                        <span className="text-sm text-gray-200">{value}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-2xl p-4 rounded-bl-none border border-gray-600 flex items-center gap-2">
              <span className="text-xs text-blue-300 mr-2">Analyzing IPsec security & retrieving evidence...</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
            placeholder="Ask an IPsec security question (e.g. Why is PFS important in IKEv2?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            disabled={loading || !input.trim()}
          >
            {loading ? 'Analyzing...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
