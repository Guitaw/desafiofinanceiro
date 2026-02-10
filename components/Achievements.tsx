
import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { ChallengeStats, Challenge } from '../types';
import { QUANTITY_ACHIEVEMENTS, VALUE_ACHIEVEMENTS, SPECIAL_ACHIEVEMENTS, ALL_ACHIEVEMENTS, AchievementDef } from '../utils/achievementDefinitions';

interface AchievementsProps {
  stats: ChallengeStats;
  challenge: Challenge;
  challengesCount: number;
}

const Achievements: React.FC<AchievementsProps> = ({ stats, challenge, challengesCount }) => {
  
  const renderGrid = (title: string, items: AchievementDef[]) => (
    <div className="space-y-6">
      <h3 className="text-xl font-black flex items-center gap-3 dark:text-white text-slate-800">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item) => {
          const isUnlocked = item.check(stats, challenge, challengesCount);
          return (
            <div 
              key={item.id}
              className={`relative group p-5 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                isUnlocked 
                  ? 'dark:bg-slate-800/40 bg-white dark:border-white/10 border-slate-200 shadow-xl scale-100 hover:scale-[1.03]' 
                  : 'dark:bg-slate-900/40 bg-slate-100 dark:border-slate-800 border-slate-200 grayscale opacity-40'
              }`}
            >
              {isUnlocked && (
                <div className={`absolute -top-12 -right-12 w-24 h-24 bg-${item.color}-500/10 blur-3xl rounded-full`} />
              )}
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${isUnlocked ? 'shadow-lg rotate-0 group-hover:rotate-12' : ''} ${
                  isUnlocked ? `bg-${item.color}-500/20 text-${item.color}-500` : 'dark:bg-slate-800 bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? item.icon : <Lock size={18} />}
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-xs font-black truncate max-w-[100px] ${isUnlocked ? 'dark:text-white text-slate-800' : 'text-slate-400'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                      {item.target}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              {isUnlocked && (
                <div className="absolute bottom-2 right-4 flex items-center gap-1">
                  <span className={`w-1 h-1 rounded-full bg-${item.color}-500 animate-pulse`} />
                  <span className={`text-[8px] font-black text-${item.color}-500 uppercase`}>Conquistado</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="dark:bg-emerald-500/5 bg-emerald-500/5 p-8 rounded-[40px] border border-emerald-500/10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Trophy size={40} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black dark:text-white text-slate-800 mb-2">Sala de Troféus</h2>
          <p className="text-slate-500 max-w-2xl text-sm font-medium">
            Você desbloqueou <span className="text-emerald-500 font-black">
              {ALL_ACHIEVEMENTS.filter(i => i.check(stats, challenge, challengesCount)).length} de 30
            </span> objetivos. Continue firme para completar sua coleção lendária!
          </p>
        </div>
      </div>

      {renderGrid("Marcos de Frequência", QUANTITY_ACHIEVEMENTS)}
      {renderGrid("Marcos de Fortuna", VALUE_ACHIEVEMENTS)}
      {renderGrid("Conquistas Mestre", SPECIAL_ACHIEVEMENTS)}
    </div>
  );
};

export default Achievements;
