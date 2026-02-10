
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, Wallet, CheckCircle2, Clock, Trophy, BarChart3, LayoutGrid, RotateCcw, Zap, Medal, Undo2, Redo2, Trash2, AlertTriangle, User, Plus, Sun, Moon, Camera, Search, Globe, FolderOpen, X, Loader2, Image as ImageIcon, Info, Home, ListTodo, ChevronLeft, ChevronRight
} from 'lucide-react';
import { DepositItem, ChallengeStats, UserProfile, Challenge, ValueRule } from './types';
import DepositGrid from './components/DepositGrid';
import Analytics from './components/Analytics';
import StatsCard from './components/StatsCard';
import Achievements from './components/Achievements';
import ProfileSidebar from './components/ProfileSidebar';
import AchievementNotification from './components/AchievementNotification';
import LoadingScreen from './components/LoadingScreen';
import HomeScreen from './components/HomeScreen';
import { ALL_ACHIEVEMENTS, AchievementDef } from './utils/achievementDefinitions';
import { GoogleGenAI } from "@google/genai";

const CHALLENGES_STORAGE_KEY = 'desafio_multi_challenges_v1';
const PROFILE_KEY = 'desafio_300_perfil_data';
const ACTIVE_ID_KEY = 'desafio_active_id_v1';
const THEME_KEY = 'desafio_theme_v1';

const generateDepositsFromRules = (rules: ValueRule[]): DepositItem[] => {
  let id = 0;
  const deposits: DepositItem[] = [];
  rules.forEach(({ value, count }) => {
    for (let i = 0; i < count; i++) {
      deposits.push({ id: id++, value, completed: false, locked: false });
    }
  });
  return deposits.sort((a, b) => a.value - b.value);
};

const DEFAULT_RULES: ValueRule[] = [
  { value: 10, count: 10 },
  { value: 20, count: 10 },
  { value: 50, count: 5 }
];

const INITIAL_CHALLENGE: Challenge = {
  id: 'default-starter',
  name: 'Meu Desafio Financeiro',
  createdAt: new Date().toISOString(),
  rules: DEFAULT_RULES,
  deposits: generateDepositsFromRules(DEFAULT_RULES),
  photo: null
};

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
      } else {
        if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    img.onerror = () => resolve(base64Str);
  });
};

const App: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [history, setHistory] = useState<DepositItem[][]>([]);
  const [future, setFuture] = useState<DepositItem[][]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'grid' | 'stats' | 'achievements'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  
  const [currentNotification, setCurrentNotification] = useState<AchievementDef | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<AchievementDef[]>([]);
  const unlockedAchievementIds = useRef<Set<string>>(new Set());
  const initialMount = useRef(true);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalTarget, setImageModalTarget] = useState<'active' | 'creating' | 'editing'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{url: string, title: string}[]>([]);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: '', email: '', bio: '', photo: null
  });

  useEffect(() => {
    try {
      const savedChallenges = localStorage.getItem(CHALLENGES_STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
      const savedProfile = localStorage.getItem(PROFILE_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY);
      
      if (savedChallenges) {
        const parsed = JSON.parse(savedChallenges);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChallenges(parsed);
          setActiveId(savedActiveId || parsed[0].id);
        } else {
          setChallenges([INITIAL_CHALLENGE]);
          setActiveId(INITIAL_CHALLENGE.id);
        }
      } else {
        setChallenges([INITIAL_CHALLENGE]);
        setActiveId(INITIAL_CHALLENGE.id);
      }
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedTheme !== null) setIsDark(savedTheme === 'dark');
    } catch (e) {
      setChallenges([INITIAL_CHALLENGE]);
      setActiveId(INITIAL_CHALLENGE.id);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
        localStorage.setItem(ACTIVE_ID_KEY, activeId);
      } catch (e) {}
    }
  }, [challenges, activeId, isLoading]);

  const activeChallenge = useMemo(() => {
    const found = challenges.find(c => c.id === activeId);
    return found || challenges[0] || INITIAL_CHALLENGE;
  }, [challenges, activeId]);

  const stats: ChallengeStats = useMemo(() => {
    const deposits = activeChallenge.deposits || [];
    const totalGoal = deposits.reduce((acc, d) => acc + d.value, 0);
    const completed = deposits.filter(d => d.completed);
    const totalDeposited = completed.reduce((acc, d) => acc + d.value, 0);
    return {
      totalDeposited, totalGoal, completedCount: completed.length,
      remainingCount: deposits.length - completed.length,
      percentage: Math.round((completed.length / deposits.length) * 100) || 0
    };
  }, [activeChallenge]);

  const remainingValue = useMemo(() => {
    return stats.totalGoal - stats.totalDeposited;
  }, [stats]);

  useEffect(() => {
    if (isLoading) return;
    const currentUnlocked = ALL_ACHIEVEMENTS.filter(a => a.check(stats, activeChallenge, challenges.length));
    if (initialMount.current) {
      unlockedAchievementIds.current = new Set(currentUnlocked.map(a => a.id));
      initialMount.current = false;
      return;
    }
    const newlyUnlocked = currentUnlocked.filter(a => !unlockedAchievementIds.current.has(a.id));
    if (newlyUnlocked.length > 0) {
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
      newlyUnlocked.forEach(a => unlockedAchievementIds.current.add(a.id));
    }
  }, [stats, activeChallenge, challenges.length, isLoading]);

  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [currentNotification, notificationQueue]);

  const updateActiveDeposits = (newDeposits: DepositItem[]) => {
    setChallenges(prev => prev.map(c => 
      c.id === activeId ? { ...c, deposits: newDeposits } : c
    ));
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture(prev => [activeChallenge.deposits, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    updateActiveDeposits(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(prev => [...prev, activeChallenge.deposits]);
    setFuture(prev => prev.slice(1));
    updateActiveDeposits(next);
  };

  const toggleDeposit = (id: number) => {
    setHistory(prev => [...prev.slice(-19), activeChallenge.deposits]);
    setFuture([]);
    const newDeposits = activeChallenge.deposits.map(d => {
      if (d.id !== id || d.locked) return d;
      return { 
        ...d, completed: !d.completed, 
        completedAt: !d.completed ? new Date().toISOString() : undefined 
      };
    });
    updateActiveDeposits(newDeposits);
  };

  const updateChallengePhoto = async (url: string | null) => {
    let finalUrl = url;
    if (url && url.startsWith('data:image')) {
      finalUrl = await compressImage(url);
    }
    if (imageModalTarget === 'active') {
      setChallenges(prev => prev.map(c => c.id === activeId ? { ...c, photo: finalUrl } : c));
    } else {
      setTempPhoto(finalUrl);
    }
    setIsImageModalOpen(false);
  };

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateChallengePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const searchWebImages = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Lista de 6 links diretos de imagens de alta resolução para o tema: "${searchQuery}".`,
        config: { tools: [{ googleSearch: {} }] }
      });
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setSearchResults(chunks.filter(c => c.web).map(c => ({ url: c.web!.uri, title: c.web!.title })));
      }
    } catch (e) {} finally { setIsSearching(false); }
  };

  const openImagePicker = (target: 'active' | 'creating' | 'editing' = 'active', currentName: string = '') => {
    setImageModalTarget(target);
    setSearchQuery(currentName || activeChallenge.name);
    setSearchResults([]);
    setIsImageModalOpen(true);
  };

  const navigateChallenge = (dir: 'prev' | 'next') => {
    const idx = challenges.findIndex(c => c.id === activeId);
    if (idx === -1) return;
    let nextIdx;
    if (dir === 'next') nextIdx = (idx + 1) % challenges.length;
    else nextIdx = (idx - 1 + challenges.length) % challenges.length;
    setActiveId(challenges[nextIdx].id);
    setHistory([]);
    setFuture([]);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 relative ${isDark ? 'bg-[#0f172a] text-slate-200' : 'bg-slate-50 text-slate-900'} pb-24`}>
      {activeChallenge.photo && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src={activeChallenge.photo} 
            className="w-full h-full object-cover opacity-45 dark:opacity-40 blur-lg scale-105 transition-all duration-700" 
            alt="" 
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0f172a]/60 via-transparent to-[#0f172a]' : 'bg-gradient-to-b from-slate-50/60 via-transparent to-slate-50'}`} />
        </div>
      )}

      <header className={`sticky top-0 z-50 border-b ${isDark ? 'glass border-white/5' : 'bg-white/80 backdrop-blur-md border-slate-200 shadow-sm'} px-4 py-4 md:px-8`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('home')} 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all ${activeTab === 'home' ? 'bg-emerald-500' : 'bg-slate-700/50 hover:bg-emerald-500'}`}
              >
                <Home size={24} />
              </button>
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-emerald-500 uppercase leading-none mb-1">Desafio de Depósitos</p>
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent uppercase truncate max-w-[200px] md:max-w-[400px]">
                  {activeTab === 'home' ? 'Dashboard Central' : activeChallenge.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 rounded-full border dark:border-white/10 overflow-hidden flex items-center justify-center bg-slate-800">
                {profile.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-400" />}
              </button>
            </div>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {[ 
              {id: 'home', label: 'Início', icon: <Home size={20} />},
              {id: 'grid', label: 'Painel', icon: activeChallenge.photo ? <img src={activeChallenge.photo} className="w-5 h-5 rounded-md object-cover" /> : <LayoutGrid size={20} />}, 
              {id: 'stats', label: 'Análise', icon: <BarChart3 size={20} />}, 
              {id: 'achievements', label: 'Conquistas', icon: <Trophy size={20} />} 
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-500 text-white shadow-lg' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:bg-slate-200')}`}>
                {t.icon} <span className="text-sm font-semibold hidden md:inline">{t.label}</span>
              </button>
            ))}
            <div className="w-[1px] h-6 mx-2 bg-slate-700/50 hidden md:block" />
            <button onClick={() => setIsDark(!isDark)} className="hidden md:flex p-2.5 rounded-xl text-yellow-400 hover:bg-slate-800 transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="hidden md:flex items-center gap-3 pl-4 ml-2 border-l border-white/10 group">
              <div className="text-right"><p className="text-[10px] font-bold text-slate-500 uppercase leading-none">Perfil</p><p className="text-sm font-bold text-slate-200 group-hover:text-emerald-400">{profile.name || 'Gerenciar'}</p></div>
              <div className="w-10 h-10 rounded-xl border-2 border-white/5 overflow-hidden flex items-center justify-center group-hover:border-emerald-500 transition-all">
                {profile.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : <User size={18} className="text-slate-400" />}
              </div>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 relative z-10">
        {activeTab === 'home' ? (
          <HomeScreen 
            stats={stats} 
            profile={profile} 
            activeChallenge={activeChallenge} 
            challenges={challenges}
            isDark={isDark} 
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onSwitchChallenge={(id) => setActiveId(id)}
          />
        ) : activeTab === 'grid' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => openImagePicker('active', activeChallenge.name)}
                  className="group relative w-14 h-14 rounded-2xl border-2 border-emerald-500/30 overflow-hidden shadow-lg transition-transform hover:scale-110 active:scale-95 flex-shrink-0"
                >
                  {activeChallenge.photo ? (
                    <img src={activeChallenge.photo} className="w-full h-full object-cover" alt="Challenge Icon" />
                  ) : (
                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white">
                      <ListTodo size={24} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={16} className="text-white" />
                  </div>
                </button>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest leading-none mb-1">Painel do Objetivo</p>
                  <h2 className="text-2xl font-black uppercase tracking-tighter truncate max-w-[200px] sm:max-w-none">
                    {activeChallenge.name}
                  </h2>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border shadow-xl ${isDark ? 'bg-slate-800/60 border-white/5' : 'bg-white border-slate-200'}`}>
                <button onClick={undo} disabled={history.length === 0} className="px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 transition-all hover:bg-emerald-500/10 rounded-xl"><Undo2 size={16} /> Desfazer</button>
                <button onClick={redo} disabled={future.length === 0} className="px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 transition-all hover:bg-emerald-500/10 rounded-xl"><Redo2 size={16} /> Refazer</button>
                <button onClick={() => setShowClearConfirm(true)} className="px-3 py-1.5 text-xs font-bold text-rose-500 flex items-center gap-1.5 transition-all hover:bg-rose-500/10 rounded-xl"><Trash2 size={16} /> Zerar</button>
              </div>
            </div>
            
            <DepositGrid deposits={activeChallenge.deposits} onToggle={toggleDeposit} onToggleLock={(id) => {
               const next = activeChallenge.deposits.map(d => d.id === id ? {...d, locked: !d.locked} : d);
               updateActiveDeposits(next);
            }} />
            
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 duration-700 pointer-events-none sm:pointer-events-auto">
              <div className="flex items-center gap-3">
                {challenges.length > 1 && (
                  <button 
                    onClick={() => navigateChallenge('prev')}
                    className={`p-2 rounded-full border shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-90 ${isDark ? 'bg-slate-900/85 border-white/10 text-emerald-500' : 'bg-white/90 border-slate-200 text-emerald-600'}`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}

                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-2xl backdrop-blur-md transition-all hover:scale-105 ${isDark ? 'bg-slate-900/85 border-white/10 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'}`}>
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Info size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-500 leading-none">Status do Desafio</span>
                    <p className="text-[10px] md:text-xs font-bold whitespace-nowrap">
                      faltam <span className="text-emerald-500 font-black">{(stats.totalGoal - stats.totalDeposited).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> para concluir.
                    </p>
                  </div>
                </div>

                {challenges.length > 1 && (
                  <button 
                    onClick={() => navigateChallenge('next')}
                    className={`p-2 rounded-full border shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-90 ${isDark ? 'bg-slate-900/85 border-white/10 text-emerald-500' : 'bg-white/90 border-slate-200 text-emerald-600'}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'stats' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Poupado" value={stats.totalDeposited.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<Wallet className="text-emerald-400" />} subtitle={`Meta: ${stats.totalGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} progress={stats.percentage} color="emerald" />
              <StatsCard title="Progresso" value={`${stats.percentage}%`} icon={<TrendingUp className="text-blue-400" />} subtitle={`${stats.completedCount} concluídos`} progress={stats.percentage} color="blue" />
              <StatsCard title="Restante" value={stats.remainingCount.toString()} icon={<Clock className="text-amber-400" />} subtitle="Notas pendentes" progress={100 - stats.percentage} color="amber" />
              <StatsCard title="Status" value={stats.percentage >= 100 ? "Concluído" : "Em curso"} icon={<Medal className="text-purple-400" />} subtitle="Meta do plano" progress={stats.percentage} color="purple" />
            </div>
            <Analytics deposits={activeChallenge.deposits} stats={stats} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Achievements stats={stats} challenge={activeChallenge} challengesCount={challenges.length} />
          </div>
        )}
      </main>

      <AchievementNotification achievement={currentNotification} onFinished={() => setCurrentNotification(null)} isDark={isDark} />

      {isImageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-[32px] border shadow-2xl overflow-hidden ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b dark:border-white/5 border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-2"><ImageIcon className="text-emerald-500" /> Personalizar Fundo</h3>
              <button onClick={() => setIsImageModalOpen(false)} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed dark:border-white/10 border-slate-200 hover:border-emerald-500 transition-all group">
                  <FolderOpen className="text-emerald-500 mb-2 group-hover:scale-110" size={32} />
                  <span className="font-bold">Arquivo Local</span>
                </button>
                <div className="flex flex-col p-6 rounded-3xl border-2 border-dashed dark:border-white/10 border-slate-200">
                   <div className="flex w-full gap-2">
                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tema..." className="flex-1 dark:bg-slate-900 bg-white border rounded-xl px-4 py-2 text-sm focus:outline-none" />
                    <button onClick={searchWebImages} className="p-2 bg-blue-500 text-white rounded-xl">{isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}</button>
                  </div>
                </div>
              </div>
              {searchResults.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={() => updateChallengePhoto(r.url)} className="aspect-video rounded-2xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all">
                      <img src={r.url} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLocalUpload} />

      <ProfileSidebar 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={profile} 
        onUpdate={(p) => { setProfile(p); try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch(e){} }} 
        challenges={challenges} 
        activeId={activeId} 
        onCreateChallenge={(name, rules, photo) => {
          const newChallenge: Challenge = {
            id: `challenge-${Date.now()}`,
            name, createdAt: new Date().toISOString(), rules,
            deposits: generateDepositsFromRules(rules), photo: photo || null
          };
          setChallenges(prev => [...prev, newChallenge]);
          setActiveId(newChallenge.id);
          setIsProfileOpen(false);
          setActiveTab('grid');
        }} 
        onDeleteChallenge={(id) => {
          const updated = challenges.filter(c => c.id !== id);
          if (updated.length === 0) {
            setChallenges([INITIAL_CHALLENGE]);
            setActiveId(INITIAL_CHALLENGE.id);
          } else {
            setChallenges(updated);
            if (activeId === id) setActiveId(updated[0].id);
          }
        }} 
        onSwitchChallenge={setActiveId} 
        onUpdateChallenge={(id, updates) => {
          setChallenges(prev => prev.map(c => {
            if (c.id === id) {
              const newC = { ...c, ...updates };
              if (updates.rules) newC.deposits = generateDepositsFromRules(updates.rules);
              return newC;
            }
            return c;
          }));
        }}
        openImagePicker={(name, isEditing) => openImagePicker(isEditing ? 'editing' : 'creating', name)}
        tempPhoto={tempPhoto}
        onClearTempPhoto={() => setTempPhoto(null)}
      />

      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="max-w-sm w-full p-8 rounded-[32px] border dark:glass bg-white dark:border-white/10 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mb-6"><AlertTriangle size={32} /></div>
            <h3 className="text-xl font-black mb-2">Zerar Desafio?</h3>
            <p className="text-sm text-slate-400 mb-8">Isso limpará todo o progresso deste desafio permanentemente.</p>
            <div className="flex flex-col w-full gap-3">
              <button onClick={() => { updateActiveDeposits(activeChallenge.deposits.map(d => ({...d, completed: false, locked: false}))); setShowClearConfirm(false); }} className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl">Zerar Tudo</button>
              <button onClick={() => setShowClearConfirm(false)} className="w-full py-4 dark:bg-slate-800 bg-slate-100 font-bold rounded-2xl">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
