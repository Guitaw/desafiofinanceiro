
import React, { useEffect, useState } from 'react';
import { Check, Trophy } from 'lucide-react';
import { AchievementDef } from '../utils/achievementDefinitions';

interface AchievementNotificationProps {
  achievement: AchievementDef | null;
  onFinished: () => void;
  isDark: boolean;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, onFinished, isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onFinished, 500); // Wait for exit animation
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [achievement, onFinished]);

  if (!achievement) return null;

  return (
    <div className={`fixed top-24 right-6 z-[200] transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className={`flex items-center gap-4 p-4 pr-6 rounded-[24px] border shadow-2xl ${isDark ? 'bg-slate-900/90 backdrop-blur-md border-white/10' : 'bg-white/90 backdrop-blur-md border-slate-200'} min-w-[280px]`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative ${isDark ? `bg-${achievement.color}-500/20 text-${achievement.color}-400` : `bg-${achievement.color}-500/10 text-${achievement.color}-600`}`}>
          <div className="animate-in zoom-in-50 duration-500">
            {achievement.icon}
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-slate-900 animate-in zoom-in-0 delay-300 fill-mode-both">
            <Check size={10} strokeWidth={4} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Trophy size={10} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Conquista Liberada!</span>
          </div>
          <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{achievement.title}</h4>
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{achievement.description}</p>
        </div>
      </div>
      
      {/* Progress bar for the notification duration */}
      <div className="absolute bottom-0 left-6 right-8 h-1 overflow-hidden rounded-full">
         <div className={`h-full bg-${achievement.color}-500 transition-all duration-[3500ms] ease-linear ${isVisible ? 'w-full' : 'w-0'}`} />
      </div>
    </div>
  );
};

export default AchievementNotification;
