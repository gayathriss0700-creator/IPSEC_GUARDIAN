import React from 'react';

export default function History() {
  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
          <span>📜</span>
          <span>Assessment History</span>
        </h2>
        
        <div className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-700/50">
          <div className="text-5xl mb-4 opacity-40">🔒</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No past assessments stored</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">All security assessments performed during your current session are displayed in the AI Assistant workspace. Session persistence will log completed reports here.</p>
        </div>
      </div>
    </div>
  );
}
