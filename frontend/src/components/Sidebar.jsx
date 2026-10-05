import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Network, 
  Activity, 
  AlertTriangle, 
  CheckSquare, 
  FlaskConical, 
  Bot, 
  Wrench, 
  FileText, 
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Radio
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: 'HOME' },
    { id: 'assessment', label: 'Security Assessment', icon: ShieldAlert, highlight: true },
    { id: 'agent-network', label: 'Agent Network', icon: Network, count: '10' },
    { id: 'threat-intel', label: 'Threat Intelligence', icon: Activity, badge: 'ML' },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: AlertTriangle, color: 'text-amber-400' },
    { id: 'compliance', label: 'Compliance', icon: CheckSquare, badge: 'NIST/STIG' },
    { id: 'simulation', label: 'What-If Simulation', icon: FlaskConical, color: 'text-purple-400' },
    { id: 'ai-analyst', label: 'AI Security Analyst', icon: Bot, badge: 'Qwen3' },
    { id: 'remediation', label: 'Remediation', icon: Wrench, color: 'text-emerald-400' },
    { id: 'reports', label: 'Security Reports', icon: FileText },
    { id: 'health', label: 'System Health', icon: HeartPulse, pulse: true },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 rounded-full bg-cyan-600 text-white shadow-lg glow-cyan border border-cyan-400/40"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#090d18]/90 backdrop-blur-xl border-r border-slate-800/80
        flex flex-col justify-between transition-all duration-300 select-none
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Header / Toggle */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
            <div className={`flex items-center space-x-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              {!collapsed && (
                <div className="font-mono text-sm font-bold text-slate-100 tracking-wider">
                  NAV CONTROL
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-300 border border-cyan-500/40 glow-cyan' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    }
                    ${item.highlight ? 'ring-1 ring-cyan-500/30' : ''}
                  `}
                >
                  <Icon className={`
                    w-4 h-4 shrink-0 transition-transform group-hover:scale-110
                    ${isActive ? 'text-cyan-400' : item.color || 'text-slate-400'}
                  `} />

                  {!collapsed && (
                    <span className="truncate flex-1 text-left font-mono tracking-tight">
                      {item.label}
                    </span>
                  )}

                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.count && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {item.count}
                    </span>
                  )}

                  {/* Active bar indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-l shadow-[0_0_8px_#22d3ee]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status Summary */}
        <div className="p-3 border-t border-slate-800/60 bg-[#060811]/60">
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                <span>System Status</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Backend:</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Models:</span>
                  <span className="text-cyan-400 font-bold">LOADED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Agent Pipeline:</span>
                  <span className="text-violet-400 font-bold">READY</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="System Ready">
              <span className="w-3 h-3 rounded-full bg-emerald-400 glow-emerald animate-pulse" />
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
