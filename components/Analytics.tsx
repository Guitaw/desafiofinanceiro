
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { DepositItem, ChallengeStats } from '../types';
import { Target, Heart, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

interface AnalyticsProps {
  deposits: DepositItem[];
  stats: ChallengeStats;
}

type ChartType = 'bar' | 'pie' | 'line';

const Analytics: React.FC<AnalyticsProps> = ({ deposits, stats }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Predefined palette that we'll cycle through
  const colors = ['#10b981', '#3b82f6', '#06b6d4', '#f59e0b', '#6366f1', '#f43f5e', '#eab308', '#8b5cf6', '#ec4899', '#14b8a6'];

  const valueDistribution = useMemo(() => {
    const uniqueValues: number[] = Array.from(new Set<number>(deposits.map(d => d.value))).sort((a: number, b: number) => a - b);
    
    return uniqueValues.map((v, idx) => {
      const total = deposits.filter(d => d.value === v).length;
      const done = deposits.filter(d => d.value === v && d.completed).length;
      return {
        name: v >= 1000 ? `${(v/1000).toFixed(1).replace('.0', '')}k` : `R$ ${v}`,
        value: v,
        total,
        done,
        pending: total - done,
        percentage: Math.round((done / total) * 100),
        fill: colors[idx % colors.length]
      };
    });
  }, [deposits]);

  const overallPieData = [
    { name: 'Concluído', value: stats.completedCount, fill: '#10b981' },
    { name: 'Pendente', value: stats.remainingCount, fill: '#cbd5e1' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="dark:bg-slate-900 bg-white border dark:border-slate-700 border-slate-200 p-3 rounded-xl shadow-2xl">
          <p className="dark:text-slate-100 text-slate-800 font-bold mb-1">{data.name}</p>
          <p className="text-emerald-500 text-sm font-bold">{`Concluídos: ${data.done}`}</p>
          <p className="text-slate-400 text-sm">{`Total: ${data.total}`}</p>
          <div className="mt-2 h-1 w-full dark:bg-slate-800 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${data.percentage}%` }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{data.percentage}% Completo</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass p-6 rounded-3xl flex flex-col transition-all border dark:border-white/5 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Target className="text-blue-500" size={20} />
            Progresso por Valor
          </h3>
          
          <div className="flex items-center gap-1 dark:bg-slate-800/50 bg-slate-100 p-1 rounded-xl border dark:border-white/5 border-slate-200">
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-500'}`}
              title="Gráfico de Barras"
            >
              <BarChart2 size={16} />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-500'}`}
              title="Gráfico de Linhas"
            >
              <LineChartIcon size={16} />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-lg transition-all ${chartType === 'pie' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-500'}`}
              title="Gráfico de Pizza"
            >
              <PieChartIcon size={16} />
            </button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={valueDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="done" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            ) : chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={valueDistribution}
                  dataKey="done"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {valueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            ) : (
              <BarChart data={valueDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
                <Bar dataKey="done" radius={[4, 4, 0, 0]} barSize={24}>
                  {valueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col transition-all border dark:border-white/5 border-slate-200">
        <h3 className="text-base font-bold mb-6 flex items-center gap-2">
          <Heart className="text-pink-500" size={20} />
          Visão Geral
        </h3>
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overallPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill={stats.percentage > 0 ? '#e2e8f0' : '#cbd5e1'} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black dark:text-white text-slate-800">{stats.percentage}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Geral</span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <span className="text-slate-400 text-xs font-bold uppercase">Concluídos</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.completedCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl dark:bg-slate-800/50 bg-slate-50 border dark:border-white/5 border-slate-200">
            <span className="text-slate-400 text-xs font-bold uppercase">Restantes</span>
            <span className="dark:text-white text-slate-700 font-bold">{stats.remainingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
