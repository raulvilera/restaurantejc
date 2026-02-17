
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { OrderStatus } from '../types';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const subscription = supabase
      .channel('orders_realtime')
      .on('postgres_changes', { event: '*', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const getStatusStyle = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'OPEN' || s === 'PENDENTE') return 'bg-blue-50 text-blue-700 border-blue-100';
    if (s === 'PREPARING' || s === 'EM PREPARO') return 'bg-orange-50 text-orange-700 border-orange-100';
    if (s === 'CLOSED' || s === 'CONCLUÍDO') return 'bg-green-50 text-green-700 border-green-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-google-text-secondary text-sm">
          <span className="material-symbols-outlined text-lg">info</span>
          Relatórios detalhados atualizados em tempo real.
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border border-google-gray-300 rounded text-sm font-medium hover:bg-white transition-all bg-google-gray-200/50">
            Exportar CSV
          </button>
          <button className="px-4 py-1.5 bg-primary text-white rounded text-sm font-bold shadow-sm hover:bg-primary/90 transition-all">
            Novo Pedido
          </button>
        </div>
      </div>

      <div className="looker-card overflow-hidden">
        <div className="p-4 border-b border-google-gray-300 bg-google-gray-100/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-google-text-primary">Registros de Transações</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-google-text-secondary text-sm">search</span>
              <input
                className="pl-8 pr-4 py-1 border border-google-gray-300 rounded text-xs focus:ring-1 focus:ring-primary w-48 outline-none"
                placeholder="Filtrar por nome..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-google-gray-200">
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight w-16">ID</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight">Cliente</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight">Itens</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight text-right">Valor</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight text-right">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-google-gray-100 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-google-text-secondary text-xs">Carregando dados da tabela...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-google-text-secondary text-xs">Nenhum registro encontrado.</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-google-gray-100/50 transition-colors group cursor-default">
                  <td className="px-6 py-3 text-xs font-mono text-google-text-secondary">#{order.order_number || order.id.substring(0, 4)}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-google-gray-200 flex items-center justify-center text-[10px] font-bold text-google-text-secondary uppercase">
                        {order.customer_name?.[0] || 'A'}
                      </div>
                      <span className="text-xs font-medium text-google-text-primary">{order.customer_name || 'Anônimo'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-google-text-secondary truncate max-w-[200px]">{order.items_content || '---'}</td>
                  <td className="px-6 py-3 text-xs font-bold text-google-text-primary text-right">{formatCurrency(order.total || 0)}</td>
                  <td className="px-6 py-3 text-[10px] text-google-text-secondary text-right">{new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-white border-t border-google-gray-300 flex items-center justify-between">
          <span className="text-[10px] text-google-text-secondary">Mostrando {orders.length} de {orders.length} linhas</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-google-gray-100 rounded disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-sm">first_page</span>
            </button>
            <button className="p-1 hover:bg-google-gray-100 rounded disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="p-1 hover:bg-google-gray-100 rounded active text-primary font-bold text-xs px-2">1</button>
            <button className="p-1 hover:bg-google-gray-100 rounded disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
            <button className="p-1 hover:bg-google-gray-100 rounded disabled:opacity-30" disabled>
              <span className="material-symbols-outlined text-sm">last_page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
