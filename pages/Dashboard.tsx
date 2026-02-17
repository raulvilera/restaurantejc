
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { supabase } from '../supabaseClient';

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
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    newCustomers: 0,
    avgTicket: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Métricas Gerais de Pedidos
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('total, customer_name, created_at');

        if (ordersError) throw ordersError;

        if (orders) {
          const totalSales = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
          const totalOrders = orders.length;
          const uniqueCustomers = new Set(orders.map(o => o.customer_name)).size;
          const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

          setMetrics({
            totalSales,
            totalOrders,
            newCustomers: uniqueCustomers,
            avgTicket
          });

          // 2. Dados do Gráfico (por dia da semana)
          const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
          const salesPerDay = days.map(day => ({ name: day, sales: 0 }));

          orders.forEach(o => {
            const dayIdx = new Date(o.created_at).getDay();
            salesPerDay[dayIdx].sales += Number(o.total || 0);
          });

          // Reordenar para começar na Segunda (índice 1)
          const reorderedChart = [...salesPerDay.slice(1), salesPerDay[0]];
          setChartData(reorderedChart);
        }

        // 3. Produtos Mais Vendidos - Agregando do order_items
        const { data: popularItems, error: popularError } = await supabase
          .from('order_items')
          .select('product_name, quantity, total');

        if (popularError) throw popularError;

        if (popularItems) {
          const productMap: Record<string, any> = {};
          popularItems.forEach(item => {
            if (!productMap[item.product_name]) {
              productMap[item.product_name] = { name: item.product_name, count: 0, total: 0 };
            }
            productMap[item.product_name].count += Number(item.quantity);
            productMap[item.product_name].total += Number(item.total);
          });

          const sorted = Object.values(productMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(item => ({
              name: item.name,
              count: `${item.count} pedidos`,
              price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total / item.count),
              img: `https://picsum.photos/seed/${item.name}/100/100`
            }));
          setTopProducts(sorted);
        }

      } catch (err) {
        console.error('Erro no dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Painel Administrativo MJC</h2>
          <p className="text-slate-500 dark:text-slate-400">Dados consolidados do sistema de gestão.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-border-dark transition-colors">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            Geral
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Vendas" value={formatCurrency(metrics.totalSales)} trend="Alt" trendType="up" icon="payments" />
        <MetricCard label="Total de Pedidos" value={metrics.totalOrders} trend="Alt" trendType="up" icon="shopping_cart" />
        <MetricCard label="Clientes na Base" value={metrics.newCustomers} trend="Alt" trendType="up" icon="person_add" />
        <MetricCard label="Ticket Médio" value={formatCurrency(metrics.avgTicket)} trend="Alt" trendType="up" icon="analytics" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
            <h3 className="text-lg font-bold">Vendas por Dia</h3>
          </div>
          <div className="p-6 h-[350px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-500">Carregando gráfico...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === chartData.length - 1 ? '#1754cf' : 'rgba(23, 84, 207, 0.2)'}
                        className="hover:fill-primary transition-colors cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark">
            <h3 className="text-lg font-bold">Destaques</h3>
          </div>
          <div className="p-6 flex-1 space-y-6">
            {topProducts.length === 0 ? (
              <p className="text-center text-slate-500 py-10">Aguardando dados de vendas...</p>
            ) : topProducts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-background-dark overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.count}</p>
                </div>
                <div className="text-sm font-bold text-primary">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
