
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgTicket: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('customer_name, customer_phone, total, created_at');

        if (error) throw error;

        // Agrupar por nome do cliente
        const customerMap: Record<string, any> = {};
        let totalSales = 0;
        let orderCount = 0;

        data?.forEach(order => {
          const name = order.customer_name || 'Anônimo';
          if (!customerMap[name]) {
            customerMap[name] = {
              name,
              contact: order.customer_phone || 'N/A',
              lastOrder: order.created_at,
              totalSpent: 0,
              initials: name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
              orderCount: 0
            };
          }
          customerMap[name].totalSpent += Number(order.total);
          customerMap[name].orderCount += 1;
          if (new Date(order.created_at) > new Date(customerMap[name].lastOrder)) {
            customerMap[name].lastOrder = order.created_at;
          }
          totalSales += Number(order.total);
          orderCount += 1;
        });

        const customerList = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(customerList);
        setStats({
          total: customerList.length,
          avgTicket: orderCount > 0 ? totalSales / orderCount : 0,
          newThisMonth: 0 // Simplificado
        });

      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-google-text-secondary text-sm">
          <span className="material-symbols-outlined text-lg">group</span>
          Gerencie e explore sua base de clientes fidelizados.
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border border-google-gray-300 rounded text-sm font-medium hover:bg-white transition-all bg-google-gray-200/50">
            Exportar XLS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="looker-card p-4">
          <p className="text-[10px] font-bold text-google-text-secondary uppercase tracking-tight mb-1">Base Ativa</p>
          <p className="text-xl font-bold text-google-text-primary">{stats.total} Clientes</p>
        </div>
        <div className="looker-card p-4">
          <p className="text-[10px] font-bold text-google-text-secondary uppercase tracking-tight mb-1">Ticket Médio Geral</p>
          <p className="text-xl font-bold text-google-text-primary">{formatCurrency(stats.avgTicket)}</p>
        </div>
        <div className="looker-card p-4 border-l-4 border-l-primary">
          <p className="text-[10px] font-bold text-google-text-secondary uppercase tracking-tight mb-1">Nível de Retenção</p>
          <p className="text-xl font-bold text-google-text-primary">85% <span className="text-[10px] font-normal text-green-600 ml-1">▲ 2%</span></p>
        </div>
      </div>

      <div className="looker-card overflow-hidden">
        <div className="p-4 border-b border-google-gray-300 bg-google-gray-100/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-google-text-primary">Explorador de Clientes</h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-google-text-secondary text-sm">search</span>
            <input
              className="pl-8 pr-4 py-1 border border-google-gray-300 rounded text-xs focus:ring-1 focus:ring-primary w-64 outline-none"
              placeholder="Pesquisar por nome ou celular..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-google-gray-200">
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight">Identidade</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight">Contato</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight">Pedidos</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight text-right">Total Gasto</th>
                <th className="px-6 py-3 text-[11px] font-bold text-google-text-secondary uppercase tracking-tight text-right">Última Visita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-google-gray-100 bg-white">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-google-text-secondary text-xs">Carregando base de clientes...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-google-text-secondary text-xs">Nenhum cliente registrado.</td></tr>
              ) : customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-google-gray-100/50 transition-colors group cursor-default">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded flex items-center justify-center bg-primary/10 text-primary font-bold text-xs uppercase">
                        {customer.initials}
                      </div>
                      <span className="text-xs font-bold text-google-text-primary">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-google-text-secondary">{customer.contact}</td>
                  <td className="px-6 py-3 text-xs text-google-text-secondary">{customer.orderCount} transações</td>
                  <td className="px-6 py-3 text-xs font-bold text-google-text-primary text-right">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-6 py-3 text-[10px] text-google-text-secondary text-right">{new Date(customer.lastOrder).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
