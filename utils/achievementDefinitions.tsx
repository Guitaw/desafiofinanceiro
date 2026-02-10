
import React from 'react';
import { 
  Trophy, Zap, Target, Sparkles, Coins, TrendingUp, ShieldCheck, Flame, Gem, Crown,
  Lock, Medal, Star, CheckCircle, Camera, Layers, ShieldAlert, Mountain, Award,
  Fingerprint, PieChart, Lightbulb, Palette
} from 'lucide-react';
import { ChallengeStats, Challenge, ValueRule } from '../types';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  check: (stats: ChallengeStats, challenge: Challenge, challengesCount: number) => boolean;
  color: string;
  target: string;
}

export const QUANTITY_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'q1', title: "Primeiro Passo", description: "Fez seu primeiro depósito no desafio.", icon: <Sparkles />, check: s => s.completedCount >= 1, color: "blue", target: "1 Dep" },
  { id: 'q2', title: "Dezena de Honra", description: "Completou seus primeiros 10 depósitos.", icon: <CheckCircle />, check: s => s.completedCount >= 10, color: "emerald", target: "10 Deps" },
  { id: 'q3', title: "Hábito Formado", description: "25 depósitos concluídos com sucesso.", icon: <Star />, check: s => s.completedCount >= 25, color: "sky", target: "25 Deps" },
  { id: 'q4', title: "No Caminho", description: "Chegou a marca de 50 depósitos.", icon: <Target />, check: s => s.completedCount >= 50, color: "amber", target: "50 Deps" },
  { id: 'q5', title: "Persistente", description: "Cruzou a linha dos 100 depósitos.", icon: <ShieldCheck />, check: s => s.completedCount >= 100, color: "orange", target: "100 Deps" },
  { id: 'q6', title: "Metade do Caminho", description: "150 depósitos. Você é imparável!", icon: <Flame />, check: s => s.completedCount >= 150, color: "rose", target: "150 Deps" },
  { id: 'q7', title: "Maratonista", description: "Marca de 200 depósitos alcançada.", icon: <Mountain />, check: s => s.completedCount >= 200, color: "indigo", target: "200 Deps" },
  { id: 'q8', title: "Especialista", description: "225 depósitos. O fim está próximo.", icon: <Gem />, check: s => s.completedCount >= 225, color: "purple", target: "225 Deps" },
  { id: 'q9', title: "Reta Final", description: "Faltam apenas 25! Chegou em 275.", icon: <Award />, check: s => s.completedCount >= 275, color: "cyan", target: "275 Deps" },
  { id: 'q10', title: "Lenda do Desafio", description: "Concluiu os 300 depósitos!", icon: <Crown />, check: s => s.completedCount >= 300, color: "yellow", target: "300 Deps" },
];

export const VALUE_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'v1', title: "Poupador Iniciante", description: "Acumulou seus primeiros R$ 10,00.", icon: <Coins />, check: s => s.totalDeposited >= 10, color: "blue", target: "R$ 10" },
  { id: 'v2', title: "Poupador Bronze", description: "Chegou aos R$ 50,00 guardados.", icon: <Award />, check: s => s.totalDeposited >= 50, color: "orange", target: "R$ 50" },
  { id: 'v3', title: "Poupador Prata", description: "Chegou aos R$ 100,00 poupados.", icon: <Medal />, check: s => s.totalDeposited >= 100, color: "slate", target: "R$ 100" },
  { id: 'v4', title: "Poupador Ouro", description: "Bateu a marca de R$ 500,00.", icon: <Trophy />, check: s => s.totalDeposited >= 500, color: "yellow", target: "R$ 500" },
  { id: 'v5', title: "Milionário em Treino", description: "Acumulou seu primeiro R$ 1.000,00.", icon: <Star />, check: s => s.totalDeposited >= 1000, color: "emerald", target: "R$ 1k" },
  { id: 'v6', title: "Investidor de Respeito", description: "Cruzou a marca de R$ 2.000,00.", icon: <TrendingUp />, check: s => s.totalDeposited >= 2000, color: "purple", target: "R$ 2k" },
  { id: 'v7', title: "Poder de Compra", description: "Chegou aos R$ 5.000,00 acumulados.", icon: <Zap />, check: s => s.totalDeposited >= 5000, color: "orange", target: "R$ 5k" },
  { id: 'v8', title: "Patrimônio de Peso", description: "Ultrapassou R$ 10.000,00 guardados.", icon: <ShieldCheck />, check: s => s.totalDeposited >= 10000, color: "rose", target: "R$ 10k" },
  { id: 'v9', title: "Cinco Dígitos Reais", description: "Acumulou R$ 20.000,00. Impressionante!", icon: <Fingerprint />, check: s => s.totalDeposited >= 20000, color: "cyan", target: "R$ 20k" },
  { id: 'v10', title: "Mestre da Fortuna", description: "Bateu a meta total do desafio!", icon: <Crown />, check: s => s.totalDeposited >= s.totalGoal && s.totalGoal > 0, color: "yellow", target: "META" },
];

export const SPECIAL_ACHIEVEMENTS: AchievementDef[] = [
  { id: 's1', title: "Visão de Águia", description: "Completou sua primeira nota POWER (>= R$ 20k).", icon: <Crown />, check: (_, c) => c.deposits.some(d => d.completed && d.value >= 20000), color: "yellow", target: "Power Note" },
  { id: 's2', title: "Salto de Fé", description: "Completou uma nota ULTRA (>= R$ 10k).", icon: <Gem />, check: (_, c) => c.deposits.some(d => d.completed && d.value >= 10000), color: "blue", target: "Ultra Note" },
  { id: 's3', title: "Sempre Seguro", description: "Travou 10 notas completadas para segurança.", icon: <Lock />, check: (_, c) => c.deposits.filter(d => d.locked).length >= 10, color: "rose", target: "10 Travas" },
  { id: 's4', title: "Estilo Único", description: "Personalizou seu desafio com uma foto.", icon: <Camera />, check: (_, c) => !!c.photo, color: "sky", target: "Foto" },
  { id: 's5', title: "Arquiteto de Sonhos", description: "Criou mais de 2 desafios diferentes.", icon: <Layers />, check: (_, __, count) => count >= 2, color: "emerald", target: "2 Desafios" },
  { id: 's6', title: "Pé no Chão", description: "Completou todas as notas de R$ 5.", icon: <PieChart />, check: (_, c) => {
      const fives = c.deposits.filter(d => d.value === 5);
      return fives.length > 0 && fives.every(d => d.completed);
    }, color: "amber", target: "Base" },
  { id: 's7', title: "Consistência 10%", description: "Alcançou os primeiros 10% da meta.", icon: <TrendingUp />, check: s => s.percentage >= 10, color: "emerald", target: "10%" },
  { id: 's8', title: "Foco Total", description: "Chegou aos 90%. Não pare agora!", icon: <ShieldAlert />, check: s => s.percentage >= 90, color: "orange", target: "90%" },
  { id: 's9', title: "Diversidade", description: "Completou notas de todas as 4 categorias.", icon: <Palette />, check: (_, c) => {
      const cats = new Set();
      c.deposits.filter(d => d.completed).forEach(d => {
        if (d.value >= 20000) cats.add('P');
        else if (d.value >= 10000) cats.add('U');
        else if (d.value >= 2000) cats.add('M');
        else cats.add('N');
      });
      return cats.size === 4;
    }, color: "purple", target: "Categorias" },
  { id: 's10', title: "Poupador Inteligente", description: "Completou uma meta com mais de 50 repetições.", icon: <Lightbulb />, check: (_, c) => c.rules.some(r => r.count >= 50), color: "cyan", target: "Esforço" },
];

export const ALL_ACHIEVEMENTS = [...QUANTITY_ACHIEVEMENTS, ...VALUE_ACHIEVEMENTS, ...SPECIAL_ACHIEVEMENTS];
