import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { FileText, CheckCircle2, Clock, Star, Calendar } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const Reports = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const priorityData = [
    { name: 'High', count: 22, percentage: 18, color: '#ef4444' },
    { name: 'Medium', count: 56, percentage: 45, color: '#f59e0b' },
    { name: 'Low', count: 46, percentage: 37, color: '#10b981' },
  ];

  const categoryHorizontalData = [
    { category: 'IT Support', count: 32 },
    { category: 'Software Issue', count: 28 },
    { category: 'Hardware Issue', count: 20 },
    { category: 'Account Access', count: 15 },
    { category: 'Network', count: 12 },
    { category: 'Others', count: 7 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header matching reference image: "Helpdesk Analytics" + "Last 7 Days v" */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Helpdesk Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Performance insights, SLA compliance, and category distribution.</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Past Year</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Cards matching bottom-right screen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value="124"
          trend="↑ 18%"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Resolved"
          value="98"
          trend="↑ 22%"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Avg. Resolution Time"
          value="4.2 hrs"
          trend="↓ 30%"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Customer Satisfaction"
          value="4.6 / 5"
          trend="↑ 12%"
          icon={Star}
          color="green"
        />
      </div>

      {/* 2 Visualizations matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tickets by Priority Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-card flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tickets by Priority</h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(value, name, props) => [`${value} tickets (${props.payload.percentage}%)`, name]} />
                  <Pie
                    data={priorityData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-3">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{item.count}</span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Category Distribution Horizontal Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Category Distribution</h3>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryHorizontalData}
                margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                  width={95}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6" 
                  radius={[0, 6, 6, 0]} 
                  barSize={12} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
