import React from 'react';

export const StatCard = ({ title, value, trend, icon: Icon, color = 'blue' }) => {
  const styles = {
    blue: {
      bg: 'bg-white',
      border: 'border-slate-100',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-200/60',
      trendColor: 'text-emerald-600',
    },
    green: {
      bg: 'bg-white',
      border: 'border-slate-100',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
      trendColor: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-slate-100',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/60',
      trendColor: 'text-amber-600',
    },
    rose: {
      bg: 'bg-white',
      border: 'border-slate-100',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-200/60',
      trendColor: 'text-rose-600',
    },
  };

  const currentStyle = styles[color] || styles.blue;

  return (
    <div className={`${currentStyle.bg} border ${currentStyle.border} rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${currentStyle.iconBg}`}>
          <Icon className="w-6 h-6 stroke-[1.75]" />
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 block">{title}</span>
          <span className="text-2xl font-bold text-slate-900 leading-tight">{value}</span>
        </div>
      </div>
      {trend && (
        <div className="mt-3.5 pt-3 border-t border-slate-50 flex items-center text-xs">
          <span className={`font-semibold ${currentStyle.trendColor}`}>{trend}</span>
        </div>
      )}
    </div>
  );
};
