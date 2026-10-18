import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MyTickets } from './pages/MyTickets';
import { CreateTicket } from './pages/CreateTicket';
import { TicketDetail } from './pages/TicketDetail';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { TicketProvider, useTickets } from './context/TicketContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const AppContent = () => {
  const { activeTab, toast } = useTickets();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-tickets':
        return <MyTickets />;
      case 'create-ticket':
        return <CreateTicket />;
      case 'ticket-detail':
        return <TicketDetail />;
      case 'knowledge-base':
        return <KnowledgeBase />;
      case 'ai-analysis':
        return <AIAnalysisPage />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Dark Navy Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Sticky Header */}
        <Header />

        {/* Page Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TicketProvider>
      <AppContent />
    </TicketProvider>
  );
}
