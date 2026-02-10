
import React, { useState, useEffect } from 'react';
import { Zap, Loader2, Sparkles, ShieldCheck, Wallet } from 'lucide-react';

const TIPS = [
  "Organizando seus cofres digitais...",
  "Calculando seu caminho para a prosperidade...",
  "Sincronizando suas metas e objetivos...",
  "Preparando suas medalhas e conquistas...",
  "O sucesso financeiro começa com o primeiro depósito.",
  "Paciência e persistência são a chave do acúmulo.",
  "Quase lá! Estamos deixando tudo pronto para você.",
  "Sua jornada de economia está sendo carregada...",
  "Dica: Tente travar suas notas para evitar gastos por impulso."
];

const LoadingScreen: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Rotacionar mensagens
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % TIPS.length);
    }, 3000);

    // Simular progresso fluido
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev + 0.5; // Desacelera no final
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[999] flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
      {/* Elementos de fundo decorativos */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="relative flex flex-col items-center max-w-sm w-full">
        {/* Ícone Animado Central */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-ping" />
          <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center border-2 shadow-2xl transition-all duration-500 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <Zap className="text-emerald-500 fill-emerald-500/20" size={48} />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-xl shadow-lg animate-bounce">
            <Sparkles size={16} />
          </div>
        </div>

        {/* Título e Texto */}
        <div className="space-y-2 mb-10">
          <h2 className={`text-2xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Desafio de <span className="text-emerald-500">Depósitos</span>
          </h2>
          <div className="h-6 overflow-hidden">
            <p key={tipIndex} className="text-sm text-slate-400 font-medium animate-in slide-in-from-bottom-2 duration-500">
              {TIPS[tipIndex]}
            </p>
          </div>
        </div>

        {/* Barra de Progresso Customizada */}
        <div className="w-full space-y-3">
          <div className={`h-2.5 w-full rounded-full overflow-hidden border ${isDark ? 'bg-slate-800 border-white/5' : 'bg-slate-200 border-slate-300'}`}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
              <ShieldCheck size={12} /> Segurança Ativa
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-500">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer do Loading */}
      <div className="absolute bottom-12 flex items-center gap-3 opacity-30 grayscale">
        <div className="flex items-center gap-2">
           <Wallet size={16} />
           <span className="text-xs font-bold uppercase tracking-widest">Financial Suite v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
