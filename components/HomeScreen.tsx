
import React from 'react';
import { 
  BarChart3, Trophy, Zap, 
  Target, Star, ChevronRight, ChevronLeft,
  ListTodo
} from 'lucide-react';
import { ChallengeStats, UserProfile, Challenge } from '../types';

interface HomeScreenProps {
  stats: ChallengeStats;
  profile: UserProfile;
  activeChallenge: Challenge;
  challenges: Challenge[];
  isDark: boolean;
  onNavigate: (tab: 'grid' | 'stats' | 'achievements') => void;
  onOpenProfile: () => void;
  onSwitchChallenge: (id: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  stats, profile, activeChallenge, challenges, isDark, onNavigate, onOpenProfile, onSwitchChallenge 
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const currentIndex = challenges.findIndex(c => c.id === activeChallenge.id);
  const totalChallenges = challenges.length;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (currentIndex + 1) % totalChallenges;
    onSwitchChallenge(challenges[nextIdx].id);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIdx = (currentIndex - 1 + totalChallenges) % totalChallenges;
    onSwitchChallenge(challenges[prevIdx].id);
  };

  // SVG dimensions for the circular progress
  const size = 140;
  const center = size / 2;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2 - 4; // Padding to prevent clipping
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Saudação e Perfil */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenProfile}
            className="w-14 h-14 rounded-[22px] border-2 border-emerald-500/20 overflow-hidden bg-slate-800 shadow-lg hover:scale-105 transition-all"
          >
            {profile.photo ? (
              <img src={profile.photo} className="w-full h-full object-cover" alt="Perfil" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-500">
                <Target size={28} />
              </div>
            )}
          </button>
          <div>
            <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {getGreeting()}, <span className="text-emerald-500">{profile.name.split(' ')[0] || 'Investidor'}</span>!
            </h2>
            <p className="text-sm font-medium text-slate-500">Pronto para bater suas metas hoje?</p>
          </div>
        </div>
      </div>

      {/* Hero Card - Resumo do Desafio Ativo (Clicável para abrir a grade) */}
      <div 
        onClick={() => onNavigate('grid')}
        className="relative group overflow-hidden rounded-[40px] border dark:border-white/10 border-slate-200 shadow-2xl transition-all hover:shadow-emerald-500/20 cursor-pointer active:scale-[0.98]"
      >
        <div className={`absolute inset-0 z-0 opacity-20 ${isDark ? 'bg-emerald-500' : 'bg-emerald-600'} group-hover:opacity-30 transition-opacity`} />
        
        <div className="relative z-10 p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                {activeChallenge.photo ? (
                  <img src={activeChallenge.photo} className="w-4 h-4 rounded-md object-cover mr-1" alt="" />
                ) : (
                  <Zap size={12} className="fill-emerald-500 mr-1" />
                )}
                Desafio em Foco
              </div>
            </div>
            
            <h3 className={`text-3xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeChallenge.name}
            </h3>
            
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Poupado</span>
                <span className="text-2xl font-black text-emerald-500">
                  {stats.totalDeposited.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="w-px h-10 bg-slate-500/20" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Faltam</span>
                <span className={`text-2xl font-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {(stats.totalGoal - stats.totalDeposited).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={center} cy={center} r={radius}
                stroke="currentColor" strokeWidth={strokeWidth - 2}
                fill="transparent"
                className="text-slate-200 dark:text-slate-800"
              />
              {/* Progress circle */}
              <circle
                cx={center} cy={center} r={radius}
                stroke="currentColor" strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.percentage}%</span>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em] mt-1 text-center">Status de<br/>Conclusão</span>
            </div>
          </div>
        </div>

        {/* Barra de Navegação Inferior (Centralizada) */}
        {totalChallenges > 1 && (
          <div className="relative z-20 px-8 pb-6 flex justify-center mt-2">
            <div 
              onClick={(e) => e.stopPropagation()} 
              className={`inline-flex items-center gap-4 px-4 py-2 rounded-2xl border backdrop-blur-md transition-all shadow-lg cursor-default ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'}`}
            >
              <button 
                onClick={handlePrev}
                className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-600'}`}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-3 min-w-[140px]">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/30 flex-shrink-0">
                   {activeChallenge.photo ? (
                     <img src={activeChallenge.photo} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white"><ListTodo size={14} /></div>
                   )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-tight">
                    Objetivo
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter leading-tight">
                    {currentIndex + 1} de {totalChallenges}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-200 text-slate-600'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid de Navegação Principal - Analítica e Conquistas lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('stats')}
          className={`group p-8 rounded-[36px] border-2 transition-all flex items-center gap-6 shadow-xl hover:scale-[1.02] active:scale-95 text-left ${
            isDark ? 'bg-slate-900/50 border-white/5 hover:border-blue-500/50' : 'bg-white border-slate-100 hover:border-blue-500/50'
          }`}
        >
          <div className="w-16 h-16 rounded-3xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:-translate-y-1 transition-transform">
            <BarChart3 size={32} />
          </div>
          <div className="flex-1">
            <h4 className={`text-xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Análises</h4>
            <p className="text-sm text-slate-500 font-medium">Veja seus gráficos e evolução detalhada.</p>
          </div>
          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={() => onNavigate('achievements')}
          className={`group p-8 rounded-[36px] border-2 transition-all flex items-center gap-6 shadow-xl hover:scale-[1.02] active:scale-95 text-left ${
            isDark ? 'bg-slate-900/50 border-white/5 hover:border-purple-500/50' : 'bg-white border-slate-100 hover:border-purple-500/50'
          }`}
        >
          <div className="w-16 h-16 rounded-3xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
            <Trophy size={32} />
          </div>
          <div className="flex-1">
            <h4 className={`text-xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Troféus</h4>
            <p className="text-sm text-slate-500 font-medium">Confira suas conquistas e medalhas.</p>
          </div>
          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Quick Access Footer */}
      <div className="flex items-center gap-4 px-2">
        <div className={`flex-1 p-5 rounded-3xl border flex items-center gap-4 ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center">
            <Star size={20} className="fill-orange-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase">Dica do dia</p>
            <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Notas de alto valor rendem conquistas exclusivas!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
