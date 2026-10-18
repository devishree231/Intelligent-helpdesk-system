import React from 'react';
import { CategoryBadge, PriorityBadge, StatusBadge } from './Badges';
import { useTickets } from '../context/TicketContext';

export const RecentTicketsTable = ({ tickets = [] }) => {
  const { openTicketDetail } = useTickets();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Tickets</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="pb-3 pl-2">Ticket ID</th>
              <th className="pb-3">Subject</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Created On</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tickets.slice(0, 5).map((ticket) => (
              <tr 
                key={ticket.id} 
                className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                onClick={() => openTicketDetail(ticket.id)}
              >
                <td className="py-3.5 pl-2 font-semibold text-slate-900">{ticket.id}</td>
                <td className="py-3.5 font-medium text-slate-700 max-w-xs truncate">{ticket.subject}</td>
                <td className="py-3.5"><CategoryBadge category={ticket.category} /></td>
                <td className="py-3.5"><PriorityBadge priority={ticket.priority} /></td>
                <td className="py-3.5"><StatusBadge status={ticket.status} /></td>
                <td className="py-3.5 text-slate-500 text-[11px] whitespace-nowrap">{ticket.createdOn}</td>
                <td className="py-3.5 text-right pr-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTicketDetail(ticket.id);
                    }}
                    className="px-3.5 py-1 text-xs font-semibold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-2xs transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tickets.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No recent tickets found.
          </div>
        )}
      </div>
    </div>
  );
};
