
import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, Mail, User, BookOpen, Save, Trash2, Settings2, Sparkles, Plus, ChevronRight, Calculator, ListTodo, AlertTriangle, Edit3, Check, Settings, Image as ImageIcon, Target } from 'lucide-react';
import { UserProfile, Challenge, ValueRule } from '../types';

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  challenges: Challenge[];
  activeId: string;
  onCreateChallenge: (name: string, rules: ValueRule[], photo: string | null) => void;
  onDeleteChallenge: (id: string) => void;
  onSwitchChallenge: (id: string) => void;
  onUpdateChallenge: (id: string, updates: Partial<Challenge>) => void;
  openImagePicker: (name: string, isEditing: boolean) => void;
  tempPhoto: string | null;
  onClearTempPhoto: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  isOpen, onClose, profile, onUpdate, challenges, activeId, onCreateChallenge, onDeleteChallenge, onSwitchChallenge, onUpdateChallenge, openImagePicker, tempPhoto, onClearTempPhoto
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'profile' | 'challenges'>('profile');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);
  const [targetChallengeId, setTargetChallengeId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formRules, setFormRules] = useState<ValueRule[]>([{ value: 10, count: 10 }]);
  const [formPhoto, setFormPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (tempPhoto !== null) {
      setFormPhoto(tempPhoto);
    }
  }, [tempPhoto]);

  useEffect(() => {
    if (!isCreating && !isEditing) onClearTempPhoto();
  }, [isCreating, isEditing]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate({ ...profile, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const addRule = () => setFormRules([...formRules, { value: 0, count: 0 }]);
  const removeRule = (idx: number) => setFormRules(formRules.filter((_, i) => i !== idx));
  const updateRule = (idx: number, key: keyof ValueRule, val: number) => {
    const next = [...formRules];
    next[idx] = { ...next[idx], [key]: val };
    setFormRules(next);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormRules([{ value: 10, count: 10 }]);
    setFormPhoto(null);
    onClearTempPhoto();
    setIsCreating(true);
  };

  const handleOpenEdit = (c: Challenge) => {
    setTargetChallengeId(c.id);
    setFormName(c.name);
    setFormRules([...c.rules]);
    setFormPhoto(c.photo);
    onClearTempPhoto();
    setIsEditing(true);
  };

  const saveChallenge = () => {
    if (!formName.trim()) return alert("Insira um nome");
    if (isCreating) {
      onCreateChallenge(formName, formRules, formPhoto);
      setIsCreating(false);
    } else if (targetChallengeId) {
      onUpdateChallenge(targetChallengeId, { name: formName, rules: formRules, photo: formPhoto });
      setIsEditing(false);
    }
  };

  const totalPossible = formRules.reduce((acc, r) => acc + (r.value * r.count), 0);
  const totalCount = formRules.reduce((acc, r) => acc + r.count, 0);

  return (
    <>
      <div className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md transition-all duration-500 ease-out transform z-[70] shadow-2xl border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'} dark:bg-[#0f172a] bg-white dark:border-white/10 border-slate-200`}>
        <div className="h-full flex flex-col relative">
          <div className="px-6 pt-6 pb-2 border-b dark:border-white/5 border-slate-100 flex items-center justify-between">
            {!isCreating && !isEditing ? (
              <div className="flex dark:bg-slate-900 bg-slate-100 p-1 rounded-2xl border dark:border-white/5 border-slate-200">
                <button onClick={() => setTab('profile')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'profile' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-emerald-500'}`}>Perfil</button>
                <button onClick={() => setTab('challenges')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'challenges' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-emerald-500'}`}>Meus Desafios</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => { setIsCreating(false); setIsEditing(false); }} className="p-2 dark:bg-slate-800 bg-slate-200 text-slate-400 rounded-xl hover:text-emerald-500 transition-colors"><ChevronRight className="rotate-180" size={18} /></button>
                <h3 className="text-base font-black dark:text-white text-slate-800">{isCreating ? 'Novo Desafio' : 'Editar Desafio'}</h3>
              </div>
            )}
            <button onClick={onClose} className="p-2 rounded-xl dark:bg-slate-800 bg-slate-200 text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {tab === 'profile' && !isCreating && !isEditing ? (
              <div className="p-8 space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] border-4 dark:border-slate-800 border-slate-100 overflow-hidden bg-slate-800 flex items-center justify-center shadow-xl">
                      {profile.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : <User size={48} className="text-slate-400" />}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 dark:border-[#0f172a] border-white"><Camera size={18} /></button>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold dark:text-white text-slate-800">{profile.name || 'Seu Nome'}</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome</label>
                    <input value={profile.name} onChange={e => onUpdate({...profile, name: e.target.value})} placeholder="Seu nome" className="w-full dark:bg-slate-800 bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm outline-none focus:border-emerald-500 transition-all" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Descrição da Meta</label>
                    <textarea 
                      value={profile.bio} 
                      onChange={e => onUpdate({...profile, bio: e.target.value})} 
                      placeholder="Descreva o que você pretende conquistar com este desafio (ex: Comprar um carro novo, Viagem de férias...)" 
                      className="w-full dark:bg-slate-800 bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm outline-none focus:border-emerald-500 transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <button onClick={onClose} className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2"><Save size={18} /> Salvar Perfil</button>
                </div>
              </div>
            ) : tab === 'challenges' && !isCreating && !isEditing ? (
              <div className="p-6 md:p-8 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-slate-400">Meus Desafios</h3>
                    <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-600 transition-all"><Plus size={14} /> Novo</button>
                  </div>
                  <div className="space-y-3">
                    {challenges.map(c => (
                      <div key={c.id} className={`p-4 rounded-2xl border transition-all cursor-pointer group ${c.id === activeId ? 'bg-emerald-500/10 border-emerald-500/30' : 'dark:bg-slate-900 bg-slate-50 dark:border-white/5 border-slate-200'}`} onClick={() => onSwitchChallenge(c.id)}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-xl overflow-hidden border flex items-center justify-center flex-shrink-0 ${c.id === activeId ? 'bg-emerald-500 border-emerald-400' : 'dark:bg-slate-800 bg-slate-200'}`}>
                              {c.photo ? <img src={c.photo} className="w-full h-full object-cover" /> : <ListTodo size={18} className={c.id === activeId ? 'text-white' : 'text-slate-400'} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-bold transition-colors truncate text-sm ${c.id === activeId ? 'text-emerald-500' : 'dark:text-slate-200 text-slate-800'}`}>{c.name}</h4>
                              <p className="text-[10px] text-slate-500 uppercase font-black">R$ {c.deposits.reduce((acc, d) => acc + d.value, 0).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }} className="p-1.5 text-slate-400 hover:text-blue-500" title="Editar Nome, Foto e Regras"><Settings size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); setChallengeToDelete(c.id); }} className="p-1.5 text-rose-500/70 hover:text-rose-500 transition-colors" title="Excluir"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8 space-y-6 pb-12 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nome do Desafio</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Ex: Viagem para o Japão" className="w-full dark:bg-slate-800 bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Fundo Visual</label>
                  <button onClick={() => openImagePicker(formName, !isCreating)} className="w-full aspect-video rounded-3xl border-2 border-dashed dark:border-white/10 border-slate-200 overflow-hidden relative group hover:border-emerald-500 transition-all">
                    {formPhoto ? (
                      <><img src={formPhoto} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white font-bold text-xs">Trocar Fundo</span></div></>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2"><ImageIcon size={32} /><span className="text-[10px] font-black uppercase">Adicionar Imagem de Fundo</span></div>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase text-slate-400 ml-1">Regras de Depósito</label><button onClick={addRule} className="text-[10px] font-black text-emerald-500 uppercase">+ Adicionar</button></div>
                  
                  {/* Cabeçalho das Colunas de Regras */}
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <span className="text-[9px] font-black uppercase text-slate-500 pl-3 tracking-tighter">Valor (R$)</span>
                      <span className="text-[9px] font-black uppercase text-slate-500 pl-3 tracking-tighter">Depósitos</span>
                    </div>
                    <div className="w-10" />
                  </div>

                  <div className="space-y-2">
                    {formRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 group">
                        <div className="flex-1 grid grid-cols-2 gap-2 p-3 dark:bg-slate-900 bg-slate-50 rounded-2xl border dark:border-white/5 border-slate-200">
                          <input type="number" value={rule.value || ''} onChange={e => updateRule(idx, 'value', Number(e.target.value))} placeholder="0.00" className="bg-transparent text-sm font-bold outline-none" />
                          <input type="number" value={rule.count || ''} onChange={e => updateRule(idx, 'count', Number(e.target.value))} placeholder="0" className="bg-transparent text-sm font-bold outline-none" />
                        </div>
                        <button onClick={() => removeRule(idx)} className="p-3 text-rose-500 opacity-50 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 dark:bg-slate-900 bg-slate-50 rounded-3xl border border-dashed flex flex-col items-center gap-2">
                  <Calculator className="text-emerald-500" size={24} />
                  <p className="text-3xl font-black">R$ {totalPossible.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black">{totalCount} depósitos no total</p>
                </div>
                <button onClick={saveChallenge} className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2">
                  <Save size={18} /> {isCreating ? 'Criar Desafio' : 'Salvar Alterações'}
                </button>
              </div>
            )}
          </div>

          {challengeToDelete && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 w-full p-8 rounded-[32px] border dark:border-white/10 shadow-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mb-6"><AlertTriangle size={32} /></div>
                <h3 className="text-xl font-black mb-2">Excluir Desafio?</h3>
                <p className="text-slate-400 text-sm mb-8">Esta ação removerá todos os dados deste desafio permanentemente.</p>
                <div className="flex flex-col w-full gap-3">
                  <button onClick={() => { onDeleteChallenge(challengeToDelete); setChallengeToDelete(null); }} className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl">Excluir Agora</button>
                  <button onClick={() => setChallengeToDelete(null)} className="w-full py-4 dark:bg-slate-800 bg-slate-100 font-bold rounded-2xl">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ProfileSidebar;
