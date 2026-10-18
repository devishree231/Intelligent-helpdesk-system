import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { CategoryBadge, PriorityBadge, StatusBadge } from '../components/Badges';
import { useTickets } from '../context/TicketContext';

export const MyTickets = () => {
  const { tickets, openTicketDetail, globalSearch, setGlobalSearch } = useTickets();

  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Status counts
  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  const tabs = [
    { id: 'All', label: 'All', count: totalCount },
    { id: 'Open', label: 'Open', count: openCount },
    { id: 'In Progress', label: 'In Progress', count: inProgressCount },
    { id: 'Resolved', label: 'Resolved', count: resolvedCount },
  ];

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (activeStatusTab !== 'All' && ticket.status.toLowerCase() !== activeStatusTab.toLowerCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All' && ticket.category !== selectedCategory) {
        return false;
      }
      // Priority filter
      if (selectedPriority !== 'All' && ticket.priority !== selectedPriority) {
        return false;
      }
      // Global search
      if (globalSearch && globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        const matches = (
          ticket.id.toLowerCase().includes(q) ||
          ticket.subject.toLowerCase().includes(q) ||
          ticket.description.toLowerCase().includes(q) ||
          ticket.category.toLowerCase().includes(q)
        );
        if (!matches) return false;
      }
      return true;
    });
  }, [tickets, activeStatusTab, selectedCategory, selectedPriority, globalSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedTickets = filteredTickets.slice((validPage - 1) * pageSize, validPage * pageSize);

  const startEntry = filteredTickets.length > 0 ? (validPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(validPage * pageSize, filteredTickets.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Tickets</h2>
      </div>

      {/* Tabs matching UI reference image: All (24), Open (3), In Progress (5), Resolved (16) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveStatusTab(tab.id);
              setCurrentPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeStatusTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tickets..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-3 pr-8 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-xs text-slate-700 font-medium px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Network">Network</option>
            <option value="Hardware Issue">Hardware Issue</option>
            <option value="Software Issue">Software Issue</option>
            <option value="Account Access">Account Access</option>
            <option value="IT Support">IT Support</option>
            <option value="Others">Others</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => {
              setSelectedPriority(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 text-xs text-slate-700 font-medium px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 pl-2">ID</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Created On</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => openTicketDetail(ticket.id)}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 pl-2 font-semibold text-slate-900">{ticket.id}</td>
                  <td className="py-3.5 font-medium text-slate-700 max-w-sm truncate">{ticket.subject}</td>
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

          {paginatedTickets.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-xs">
              No tickets found matching your filter criteria.
            </div>
          )}
        </div>

        {/* Pagination matching reference image */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{startEntry}-{endEntry}</span> of <span className="font-semibold text-slate-800">{filteredTickets.length}</span> tickets
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validPage <= 1}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  validPage === pageNumber
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
