import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusSquare, 
  BookOpen, 
  BarChart3, 
  Sparkles,
  Settings, 
  Headphones
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';

export const Sidebar = () => {
  const { activeTab, setActiveTab } = useTickets();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-tickets', label: 'My Tickets', icon: Ticket },
    { id: 'create-ticket', label: 'Create Ticket', icon: PlusSquare },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#0e1726] text-slate-300 flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-slate-800 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Headphones className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">HelpDesk AI</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Settings */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
