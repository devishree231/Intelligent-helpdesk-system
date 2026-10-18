import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const TrendChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { day: "Oct 9", created: 6, resolved: 5 },
    { day: "Oct 10", created: 6, resolved: 5 },
    { day: "Oct 11", created: 7, resolved: 4 },
    { day: "Oct 12", created: 6, resolved: 4 },
    { day: "Oct 13", created: 6, resolved: 4 },
    { day: "Oct 14", created: 7, resolved: 5 },
    { day: "Oct 15", created: 8, resolved: 6 },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Ticket Trend (Last 7 Days)</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
            <span className="text-slate-600 font-medium">Created</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">Resolved</span>
          </div>
        </div>
      </div>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b' }}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                fontSize: '12px' 
              }}
            />
            <Bar 
              dataKey="created" 
              name="Created" 
              fill="#2563eb" 
              radius={[4, 4, 0, 0]} 
              barSize={10} 
            />
            <Bar 
              dataKey="resolved" 
              name="Resolved" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={10} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
