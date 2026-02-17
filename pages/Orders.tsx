
import React, { useState, useEffect } from 'react';
import { OrderStatus } from '../types';
import { supabase } from '../lib/supabase';

const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500 border-amber-200 dark:border-amber-500/20',
  [OrderStatus.PREPARING]: 'bg-primary/10 text-primary border-primary/20',
  [OrderStatus.COMPLETED]: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20',
};

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Configurar realtime
    const subscription = supabase
      .channel('orders_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Pedidos</h2>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-surface-dark px-3 py-1.5 rounded-full border border-slate-200 dark:border-border-dark">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ao Vivo</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-sm">add</span>
            Novo Pedido
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['Todos os Pedidos', 'Pendentes', 'Em Preparo', 'Concluídos'].map((filter, i) => (
          <button
            key={filter}
            className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-500 hover:border-primary'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-border-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-background-dark/50 border-b border-slate-200 dark:border-border-dark">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Itens do Pedido</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valor Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-bold">Carregando pedidos...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-bold">Nenhum pedido encontrado.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/20 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-primary">{order.id}</span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">{order.order_time}</p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 dark:bg-background-dark flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {order.customer_initial}
                        </div>
                        <span className="text-sm font-semibold">{order.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 max-w-xs">{order.items}</p>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold">R$ {Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusStyles[order.status as OrderStatus]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button className="bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all">
                          {order.status === OrderStatus.COMPLETED ? 'Reabrir' : 'Atualizar Status'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-background-dark/30">
          <p className="text-xs text-slate-500 font-medium">Mostrando {orders.length} pedidos</p>
          <div className="flex items-center gap-2">
            <button className="size-8 flex items-center justify-center border border-slate-200 dark:border-border-dark rounded-lg text-slate-400 disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="size-8 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-lg shadow-sm">1</button>
            <button className="size-8 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-surface-dark rounded-lg">2</button>
            <button className="size-8 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-surface-dark rounded-lg">3</button>
            <button className="size-8 flex items-center justify-center border border-slate-200 dark:border-border-dark rounded-lg text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Tempo Médio Preparo', value: '24m', change: '-2m vs ontem', icon: 'avg_time', color: 'text-primary' },
          { label: 'Pedidos Concluídos', value: '84', change: 'Meta: 100', icon: 'trending_up', color: 'text-emerald-500' },
          { label: 'Atrasos Atuais', value: '02', change: '+1 últimos 30m', icon: 'warning', color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-border-dark flex items-center gap-4">
            <div className={`size-12 rounded-full flex items-center justify-center ${stat.color} bg-current/10`}>
              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value} <span className="text-xs font-medium opacity-70 ml-1">{stat.change}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
