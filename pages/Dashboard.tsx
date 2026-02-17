import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { supabase } from '../lib/supabase';

const data = [
  { name: 'Seg', sales: 400 },
  { name: 'Ter', sales: 650 },
  { name: 'Qua', sales: 500 },
  { name: 'Qui', sales: 800 },
  { name: 'Sex', sales: 700 },
  { name: 'Sab', sales: 900 },
  { name: 'Dom', sales: 1250 },
];

const MetricCard = ({ label, value, trend, trendType, icon }: any) => (
  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trendType === 'up' ? 'bg-green-500/10 text-green-500' :
        trendType === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
        }`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className={`flex items-center font-medium ${trendType === 'up' ? 'text-green-500' :
          trendType === 'down' ? 'text-red-500' : 'text-slate-400'
          }`}>
          <span className="material-symbols-outlined text-sm">
            {trendType === 'up' ? 'trending_up' : trendType === 'down' ? 'trending_down' : 'remove'}
          </span>
          {trend}
        </span>
        <span className="text-slate-400 text-xs">vs. mês passado</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    newCustomers: 0,
    avgTicket: 0
  });
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar pedidos para calcular vendas e totais
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, status');

      if (ordersError) throw ordersError;

      const totalSales = (orders || [])
        .filter(o => o.status === 'CONCLUÍDO')
        .reduce((acc, curr) => acc + Number(curr.total), 0);

      const totalOrders = (orders || []).length;
      const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Buscar total de clientes
      const { count: customerCount, error: customerError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (customerError) throw customerError;

      // Buscar mais vendidos (simulado baseado nos itens do menu para este exemplo)
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .limit(3);

      if (menuError) throw menuError;

      setStats({
        totalSales,
        totalOrders,
        newCustomers: customerCount || 0,
        avgTicket
      });
      setBestSellers(menuItems || []);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Painel Administrativo</h2>
          <p className="text-slate-500 dark:text-slate-400">Aqui está o resumo do MJC Restaurante para hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-border-dark transition-colors">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Últimos 30 dias
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Novo Pedido
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Vendas" value={`R$ ${stats.totalSales.toFixed(2)}`} trend="Calculado" trendType="neutral" icon="payments" />
        <MetricCard label="Total de Pedidos" value={stats.totalOrders.toString()} trend="Total" trendType="neutral" icon="shopping_cart" />
        <MetricCard label="Total de Clientes" value={stats.newCustomers.toString()} trend="Base" trendType="up" icon="person_add" />
        <MetricCard label="Ticket Médio" value={`R$ ${stats.avgTicket.toFixed(2)}`} trend="Global" trendType="up" icon="analytics" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
            <h3 className="text-lg font-bold">Desempenho de Vendas</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                Vendas (R$)
              </span>
            </div>
          </div>
          <div className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a303c" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(23, 84, 207, 0.05)' }}
                  contentStyle={{ backgroundColor: '#161b26', borderRadius: '8px', border: '1px solid #2a303c', color: '#fff' }}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === data.length - 1 ? '#1754cf' : 'rgba(23, 84, 207, 0.2)'}
                      className="hover:fill-primary transition-colors cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark">
            <h3 className="text-lg font-bold">Mais Vendidos</h3>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {loading ? (
              <div className="text-center py-10 text-slate-500 font-bold">Carregando itens...</div>
            ) : bestSellers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-bold">Nenhum prato disponível.</div>
            ) : (
              bestSellers.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-background-dark overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <div className="text-sm font-bold text-primary">R$ {Number(item.price).toFixed(2)}</div>
                </div>
              ))
            )}
            <button className="w-full py-2.5 mt-auto text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors border border-primary/10">
              Ver Cardápio Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
