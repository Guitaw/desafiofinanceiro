
import React from 'react';
import { Check, Lock, Unlock, Zap, Gem, Crown } from 'lucide-react';
import { DepositItem } from '../types';

interface DepositGridProps {
  deposits: DepositItem[];
  onToggle: (id: number) => void;
  onToggleLock: (id: number) => void;
}

const DepositGrid: React.FC<DepositGridProps> = ({ deposits, onToggle, onToggleLock }) => {
  
  const getCategoryStyles = (value: number) => {
    if (value >= 20000) {
      return {
        border: 'border-amber-500/50 shadow-amber-500/10',
        bg: 'dark:bg-amber-500/10 bg-amber-50/50',
        text: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
        label: 'POWER',
        icon: <Crown size={10} />
      };
    }
    if (value >= 10000) {
      return {
        border: 'border-blue-500/50 shadow-blue-500/10',
        bg: 'dark:bg-blue-500/10 bg-blue-50/50',
        text: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
        label: 'ULTRA',
        icon: <Gem size={10} />
      };
    }
    if (value >= 2000) {
      return {
        border: 'border-purple-500/50 shadow-purple-500/10',
        bg: 'dark:bg-purple-500/10 bg-purple-50/50',
        text: 'text-purple-600 dark:text-purple-400',
        badge: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
        label: 'MEGA',
        icon: <Zap size={10} />
      };
    }
    return null; // Normal (< 2000)
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 md:gap-4 pb-10">
      {deposits.map((deposit, index) => {
        const category = getCategoryStyles(deposit.value);
        
        return (
          <div key={deposit.id} className="relative group">
            <button
              onClick={() => !deposit.locked && onToggle(deposit.id)}
              disabled={deposit.locked}
              className={`
                w-full relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2
                ${deposit.completed 
                  ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10' 
                  : `dark:bg-slate-800/50 bg-white dark:border-slate-700 border-slate-200 hover:border-emerald-500 hover:scale-105 shadow-sm ${category?.border || ''} ${category?.bg || ''}`}
                ${deposit.locked ? 'cursor-default ring-2 ring-emerald-500/20 opacity-90' : 'cursor-pointer'}
              `}
            >
              {/* Box Number Indicator */}
              <div className={`absolute top-1.5 left-2 text-[7px] font-black tracking-tighter transition-colors ${deposit.completed ? 'text-emerald-500/40' : 'text-slate-400/30'}`}>
                #{index + 1}
              </div>

              {deposit.completed && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-10 animate-bounce-slow">
                  <Check size={12} strokeWidth={4} />
                </div>
              )}
              
              <div className={`text-[9px] font-bold uppercase tracking-widest ${deposit.completed ? 'text-emerald-500' : 'text-slate-400'}`}>
                {category ? category.label : 'Depósito'}
              </div>
              
              <div className={`text-sm md:text-base font-black ${deposit.completed ? 'text-emerald-600 dark:text-emerald-400' : (category?.text || 'dark:text-slate-200 text-slate-700')}`}>
                {deposit.value >= 1000 
                  ? `R$ ${(deposit.value / 1000).toFixed(0)}k` 
                  : `R$ ${deposit.value}`}
              </div>

              {category && !deposit.completed && (
                 <div className={`absolute bottom-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black ${category.badge}`}>
                   {category.icon}
                 </div>
              )}
            </button>

            {deposit.completed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(deposit.id);
                }}
                className={`
                  absolute bottom-2 right-2 p-1.5 rounded-lg transition-all duration-300 z-20
                  ${deposit.locked 
                    ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40' 
                    : 'dark:bg-slate-700/50 bg-slate-100 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 border border-black/5 dark:border-white/5'}
                `}
                title={deposit.locked ? "Desbloquear nota" : "Bloquear nota"}
              >
                {deposit.locked ? <Lock size={12} /> : <Unlock size={12} className="opacity-0 group-hover:opacity-100" />}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DepositGrid;
