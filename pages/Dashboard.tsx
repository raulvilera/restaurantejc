import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { supabase } from '../supabaseClient';

const MetricCard = ({ label, value, trend, trendType }: any) => (
  <div className="looker-card p-5">
    <p className="text-[11px] font-medium text-google-text-secondary uppercase tracking-wider mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-semibold text-google-text-primary">{value}</h3>
      {trend && (
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${trendType === 'up' ? 'text-green-600 bg-green-50' :
            trendType === 'down' ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-50'
          }`}>
          {trendType === 'up' ? '▲' : trendType === 'down' ? '▼' : ''} {trend}
        </span>
      )}
    </div>
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
            .slice(0, 5)
            .map(item => ({
              name: item.name,
              count: `${item.count} un`,
              price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total),
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex bg-white border border-google-gray-300 p-4 rounded-lg items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-google-text-secondary">calendar_month</span>
            <span className="text-sm font-medium">Período: Últimos 30 dias</span>
            <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
          </div>
          <div className="w-[1px] h-6 bg-google-gray-300"></div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors text-google-text-secondary">
            <span className="material-symbols-outlined">filter_alt</span>
            <span className="text-sm font-medium">Filtros</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Faturamento Total" value={formatCurrency(metrics.totalSales)} trend="10.2%" trendType="up" />
        <MetricCard label="Volume de Pedidos" value={metrics.totalOrders} trend="4.5%" trendType="up" />
        <MetricCard label="Total de Clientes" value={metrics.newCustomers} trend="2.1%" trendType="down" />
        <MetricCard label="Ticket Médio" value={formatCurrency(metrics.avgTicket)} trend="0.0%" trendType="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 looker-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-google-text-primary">Distribuição de Vendas por Dia</h3>
            <span className="material-symbols-outlined text-google-text-secondary cursor-pointer">more_vert</span>
          </div>
          <div className="h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-google-text-secondary text-sm">Carregando dados do gráfico...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eaed" />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: '#dadce0' }}
                    tickLine={false}
                    tick={{ fill: '#5f6368', fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#5f6368', fontSize: 11 }}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f3f4' }}
                    contentStyle={{ border: '1px solid #dadce0', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Bar dataKey="sales" fill="#1a73e8" radius={[2, 2, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="looker-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-google-text-primary">Itens Mais Vendidos (Top)</h3>
            <span className="material-symbols-outlined text-google-text-secondary cursor-pointer">download</span>
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-center text-google-text-secondary text-xs py-10">Nenhum dado disponível.</p>
            ) : topProducts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-google-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-xs font-medium text-google-text-primary">{item.name}</p>
                  <p className="text-[10px] text-google-text-secondary">{item.count}</p>
                </div>
                <div className="text-xs font-semibold text-google-text-primary">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
