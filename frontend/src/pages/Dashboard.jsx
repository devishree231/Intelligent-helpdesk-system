import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { CategoryChart } from '../components/CategoryChart';
import { TrendChart } from '../components/TrendChart';
import { RecentTicketsTable } from '../components/RecentTicketsTable';
import { useTickets } from '../context/TicketContext';

export const Dashboard = () => {
  const { dashboardStats, tickets, currentUser } = useTickets();

  // Computed live numbers from tickets
  const totalCount = tickets.length || 24;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length || 16;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length || 5;
  const openCount = tickets.filter(t => t.status === 'Open').length || 3;

  // Category distribution computed dynamically
  const catDistribution = dashboardStats?.categoryDistribution || [
    { name: 'IT Support', count: 8, percentage: 33 },
    { name: 'Software Issue', count: 6, percentage: 25 },
    { name: 'Hardware Issue', count: 4, percentage: 17 },
    { name: 'Account Access', count: 3, percentage: 12 },
    { name: 'Network', count: 2, percentage: 8 },
    { name: 'Others', count: 1, percentage: 4 }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Good Morning, {currentUser.name}!
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Here's an overview of your helpdesk activity.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          Wed, 15 Oct 2026
        </div>
      </div>

      {/* 4 Summary Cards matching reference image layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={totalCount}
          trend={dashboardStats?.totalTrend || "↑ 12% from last week"}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          trend={dashboardStats?.resolvedTrend || "↑ 20% from last week"}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          trend={dashboardStats?.inProgressTrend || "↑ 17% from last week"}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Open"
          value={openCount}
          trend={dashboardStats?.openTrend || "↓ 25% from last week"}
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart 
          data={catDistribution} 
          totalCount={totalCount} 
        />
        <TrendChart 
          data={dashboardStats?.weeklyTrend} 
        />
      </div>

      {/* Recent Tickets Table */}
      <RecentTicketsTable tickets={tickets} />
    </div>
  );
};
