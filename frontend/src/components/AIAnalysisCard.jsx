import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  GitBranch, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Users, 
  HelpCircle,
  ThumbsUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CategoryBadge } from './Badges';
import { useTickets } from '../context/TicketContext';

export const AIAnalysisCard = ({ ticket }) => {
  const { openTicketDetail, showToast } = useTickets();
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!ticket) return null;

  const confidencePct = Math.round((ticket.aiConfidence || 0.92) * 100);
  const similarCount = ticket.similarTicketCount || (ticket.similarTickets?.length || 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Analysis</h3>
            <span className="text-[11px] text-slate-400">Automated Root-Cause & Solution Engine</span>
          </div>
        </div>

        {/* Model Confidence Meter */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500">Confidence:</span>
          <span className="text-xs font-bold text-blue-600">{confidencePct}%</span>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${confidencePct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main AI Insights Grid */}
      <div className="mt-5 space-y-4">
        {/* Predicted Category */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Predicted Category</span>
          </div>
          <div>
            <CategoryBadge category={ticket.category} />
          </div>
        </div>

        {/* Probable Root Cause */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <GitBranch className="w-4 h-4 text-purple-500" />
            <span>Probable Root Cause</span>
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
              {ticket.rootCause || "VPN server issue"}
            </span>
          </div>
        </div>

        {/* Hierarchical Root Cause Tree */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Hierarchical Root-Cause Mapping
          </span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-700">
            {ticket.rootCausePath ? (
              ticket.rootCausePath.split('>').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={`px-2 py-0.5 rounded ${idx === arr.length - 1 ? 'bg-purple-100 text-purple-800 font-semibold' : 'bg-white border border-slate-200'}`}>
                    {part.trim()}
                  </span>
                  {idx < arr.length - 1 && <span className="text-slate-400">➔</span>}
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Network</span>
                <span className="text-slate-400">➔</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">VPN</span>
                <span className="text-slate-400">➔</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">VPN server issue</span>
              </>
            )}
          </div>
        </div>

        {/* Suggested Solution */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Suggested Solution</span>
          </div>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900 leading-relaxed">
            {ticket.suggestedSolution || "Restart VPN client / check server status"}
          </div>
        </div>

        {/* Support Team Routing */}
        <div className="flex items-center justify-between text-xs py-1">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Suggested Support Team:</span>
          </div>
          <span className="font-semibold text-slate-800">{ticket.suggestedTeam || "Network Operations"}</span>
        </div>

        {/* Similar Tickets Detection */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowDuplicates(!showDuplicates)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200/80 text-xs font-medium text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Copy className="w-3.5 h-3.5 text-blue-600" />
              <span>Similar Tickets: <strong>{similarCount} similar tickets found</strong></span>
            </div>
            {showDuplicates ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Similar Tickets Drawer */}
          {showDuplicates && (
            <div className="mt-2.5 space-y-2 pl-1 animate-in fade-in duration-150">
              {(ticket.similarTickets && ticket.similarTickets.length > 0 ? ticket.similarTickets : [
                { id: "#HD-1018", subject: "Cisco AnyConnect Gateway timeout", similarity: 94, status: "Resolved", solution: "Switched to secondary failover gateway IP" },
                { id: "#HD-1012", subject: "VPN keeps disconnecting after 5 minutes", similarity: 88, status: "Resolved", solution: "Adjusted MTU packet size to 1350" },
                { id: "#HD-0995", subject: "VPN authentication loop error", similarity: 79, status: "Resolved", solution: "Reinstalled client profile certificate" }
              ]).map((sim) => (
                <div 
                  key={sim.id}
                  onClick={() => openTicketDetail(sim.id)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 hover:text-blue-600">{sim.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      {sim.similarity}% match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 truncate">{sim.subject}</p>
                  {sim.solution && (
                    <p className="text-[10px] text-emerald-700 bg-emerald-50/80 p-1 rounded mt-1.5 line-clamp-1">
                      Resolution: {sim.solution}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Human Feedback Verification */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Human in the loop:</span>
          <button
            onClick={() => {
              setIsVerified(!isVerified);
              showToast(isVerified ? "Verification cleared" : "AI Root Cause verified by engineer!");
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              isVerified
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{isVerified ? "Verified Root Cause" : "Verify AI Prediction"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
