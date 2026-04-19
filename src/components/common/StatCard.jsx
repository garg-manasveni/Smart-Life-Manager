import React from 'react';

export default function StatCard({ title, value, detail, subtitle, icon, bgColor, borderClass = 'border-slate-200' }) {
  return (
    <div className={`${bgColor} ${borderClass} rounded-[1.75rem] p-6 shadow-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(15,23,42,0.35)]`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-500 mb-3">{title}</p>
          <p className="text-4xl font-semibold text-slate-900">{value}</p>
          {detail && <p className="text-sm text-slate-500 mt-2">{detail}</p>}
          <p className="text-sm text-slate-600 mt-3">{subtitle}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white shadow-sm text-3xl">{icon}</div>
      </div>
    </div>
  );
}
