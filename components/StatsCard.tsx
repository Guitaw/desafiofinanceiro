
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
  progress: number;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, subtitle, progress, color }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const barColorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="glass p-5 rounded-3xl group border transition-all duration-500 dark:hover:border-white/20 hover:border-slate-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-2xl ${colorMap[color]} border`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black mt-1 dark:text-slate-100 text-slate-800">{value}</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">{subtitle}</span>
          <span className="dark:text-slate-200 text-slate-700 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full dark:bg-slate-800 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColorMap[color]} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
