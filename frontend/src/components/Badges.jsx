import React from 'react';

export const CategoryBadge = ({ category }) => {
  const styles = {
    'Network': 'bg-blue-50 text-blue-600 border border-blue-200',
    'Hardware Issue': 'bg-purple-50 text-purple-600 border border-purple-200',
    'Account Access': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    'Software Issue': 'bg-amber-50 text-amber-600 border border-amber-200',
    'IT Support': 'bg-sky-50 text-sky-600 border border-sky-200',
    'Others': 'bg-slate-50 text-slate-600 border border-slate-200',
  };

  const style = styles[category] || 'bg-gray-100 text-gray-700 border border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {category}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    'High': 'bg-rose-50 text-rose-600 border border-rose-200',
    'Medium': 'bg-amber-50 text-amber-600 border border-amber-200',
    'Low': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  };

  const style = styles[priority] || 'bg-gray-50 text-gray-600 border border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {priority}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    'Open': 'bg-rose-50 text-rose-600 border border-rose-200',
    'In Progress': 'bg-amber-50 text-amber-600 border border-amber-200',
    'Resolved': 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    'Escalated': 'bg-purple-50 text-purple-600 border border-purple-200',
  };

  const style = styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};
