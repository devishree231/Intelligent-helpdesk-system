import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const CategoryChart = ({ data = [], totalCount = 24 }) => {
  const COLOR_MAP = {
    'IT Support': '#3b82f6',
    'Software Issue': '#10b981',
    'Hardware Issue': '#8b5cf6',
    'Account Access': '#ec4899',
    'Network': '#f97316',
    'Others': '#64748b'
  };

  const chartData = data.length > 0 ? data : [
    { name: 'IT Support', count: 8, percentage: 33 },
    { name: 'Software Issue', count: 6, percentage: 25 },
    { name: 'Hardware Issue', count: 4, percentage: 17 },
    { name: 'Account Access', count: 3, percentage: 12 },
    { name: 'Network', count: 2, percentage: 8 },
    { name: 'Others', count: 1, percentage: 4 }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">Tickets by Category</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut with center text */}
        <div className="relative w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                formatter={(value, name, props) => [`${value} tickets (${props.payload.percentage}%)`, name]}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLOR_MAP[entry.name] || '#94a3b8'} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Donut Center Count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900 leading-none">{totalCount}</span>
            <span className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend with percentages */}
        <div className="flex-1 w-full space-y-2">
          {chartData.map((item) => {
            const color = COLOR_MAP[item.name] || '#94a3b8';
            return (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{item.count}</span>
                  <span className="text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
