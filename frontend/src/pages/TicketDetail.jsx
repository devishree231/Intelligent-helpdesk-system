import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  UserPlus, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/Badges';
import { AIAnalysisCard } from '../components/AIAnalysisCard';
import { useTickets } from '../context/TicketContext';

export const TicketDetail = () => {
  const { 
    currentTicket, 
    setActiveTab, 
    updateStatus, 
    assignTicket, 
    addTicketComment,
    currentUser,
    showToast
  } = useTickets();

  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigneeName, setAssigneeName] = useState('Alex Rivera');

  if (!currentTicket) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">No ticket selected.</p>
        <button
          onClick={() => setActiveTab('my-tickets')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await addTicketComment(currentTicket.id, commentText);
      setCommentText('');
    } catch (e) {
      //
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAssign = async () => {
    await assignTicket(currentTicket.id, assigneeName);
    setShowAssignModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back Button and Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('my-tickets')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </button>

        {/* Status Transition Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <select
            value={currentTicket.status}
            onChange={(e) => updateStatus(currentTicket.id, e.target.value)}
            className="bg-white text-xs font-semibold text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Ticket Header Card matching reference UI */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">
              Ticket {currentTicket.id}
            </span>
            <h1 className="text-lg font-bold text-slate-900">
              {currentTicket.subject}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <CategoryBadge category={currentTicket.category} />
            <PriorityBadge priority={currentTicket.priority} />
            <StatusBadge status={currentTicket.status} />
          </div>
        </div>

        {/* Metadata info */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Created by</span>
            <span className="font-semibold text-slate-800">
              {currentTicket.createdBy || "Shreenithi"} (Employee)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Created On</span>
            <span className="font-semibold text-slate-800">{currentTicket.createdOn || "15 Oct 2026, 10:24 AM"}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Last Updated</span>
            <span className="font-semibold text-slate-800">{currentTicket.lastUpdated || "15 Oct 2026, 02:10 PM"}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Description & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Description Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Description
            </h3>
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {currentTicket.description}
            </div>
          </div>

          {/* Actions matching reference image: Assign & Add Comment buttons */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Actions
              </h3>
              {currentTicket.assignedTo && (
                <span className="text-xs text-slate-600">
                  Assigned to: <strong className="text-blue-600">{currentTicket.assignedTo}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>Assign</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('comment-input');
                  if (elem) elem.focus();
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Add Comment</span>
              </button>
            </div>

            {/* Quick Assign Dropdown inline */}
            {showAssignModal && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-semibold text-slate-700">Assign Support Engineer:</span>
                <div className="flex items-center gap-2">
                  <select
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="bg-white text-xs text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    <option value="Alex Rivera">Alex Rivera (Network Specialist)</option>
                    <option value="Sarah Connor">Sarah Connor (Hardware Lead)</option>
                    <option value="David Wallace">David Wallace (IAM Engineer)</option>
                    <option value="Kelly Kapoor">Kelly Kapoor (App Support)</option>
                  </select>
                  <button
                    onClick={handleAssign}
                    className="px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity / Comments Stream */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Discussion & Resolution History
            </h3>

            <div className="space-y-3">
              {(currentTicket.comments && currentTicket.comments.length > 0 ? currentTicket.comments : [
                {
                  id: 1,
                  author: "Shreenithi",
                  role: "Employee",
                  text: currentTicket.description,
                  date: currentTicket.createdOn,
                  isAi: false
                }
              ]).map((c, i) => (
                <div 
                  key={c.id || i}
                  className={`p-4 rounded-xl border text-xs ${
                    c.isAi
                      ? 'bg-gradient-to-r from-blue-50/60 to-purple-50/50 border-blue-200'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {c.isAi ? (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          {c.author ? c.author[0] : 'U'}
                        </span>
                      )}
                      <span className="font-bold text-slate-800">{c.author}</span>
                      <span className="text-[10px] text-slate-400">({c.role})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{c.date}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-7">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleCommentSubmit} className="pt-2">
              <div className="relative">
                <input
                  id="comment-input"
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a message or update..."
                  className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-4 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Analysis Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <AIAnalysisCard ticket={currentTicket} />
        </div>
      </div>
    </div>
  );
};
